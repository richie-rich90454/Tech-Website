/**
 * ============================================================================
 * MULTIPART FORM PARSER (application/x-www-form-parts, RFC 7578 subset)
 * ============================================================================
 *
 * PURPOSE
 * The tool-submission form uploads a screenshot FILE alongside text fields.
 * Node's http module gives us the raw body; this module splits it into fields
 * + one file without pulling in a dependency.
 *
 * SCOPE (deliberately narrow - read before extending):
 *   - One boundary, one optional file part, unlimited small text parts.
 *   - Buffers in memory with a HARD cap (see MAX_UPLOAD_BYTES). This endpoint
 *     is admin/submission-only and screenshots are small; that trade-off is
 *     documented instead of hidden behind streaming complexity.
 *
 * LEARN: HOW MULTIPART WORKS
 * The client sends:  --BOUNDARY\r\n headers \r\n\r\n data \r\n --BOUNDARY-- \r\n
 * Parsing = splitting on the boundary and reading each part's tiny header
 * block. Everything below is that sentence, plus safety rails.
 */

import type { Context } from '../core/03-context';
import { HttpError } from '../core/09-errors';

export const MAX_UPLOAD_BYTES = 5_000_000; // 5 MB total body incl. file

export interface MultipartFile {
    filename: string;
    contentType: string;
    data: Buffer;
}

export interface MultipartResult {
    fields: Record<string, string>;
    file: MultipartFile | null;
}

/** Extract `boundary=...` from a multipart Content-Type header value. */
function boundaryOf(contentType: string): string | null {
    const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
    return m ? (m[1] ?? m[2]).trim() : null;
}

/** Pull name/filename/contentType out of a part's Content-Disposition line. */
function dispositionOf(headerBlock: string): {
    name: string;
    filename?: string;
    contentType: string;
} {
    let name = '';
    let filename: string | undefined = undefined;
    let contentType = 'text/plain';
    for (const line of headerBlock.split('\r\n')) {
        const [key, ...rest] = line.split(':');
        const value = rest.join(':').trim();
        if (/^content-disposition$/i.test(key)) {
            const nm = /name="([^"]*)"/i.exec(value);
            if (nm) name = nm[1];
            const fn = /filename="([^"]*)"/i.exec(value);
            if (fn) filename = fn[1];
        } else if (/^content-type$/i.test(key)) {
            contentType = value;
        }
    }
    return { name, filename, contentType };
}

/**
 * Parse ctx.raw into fields + at most one file.
 * Throws HttpError(400/413) on malformed or oversized input.
 */
export async function readMultipart(ctx: Context): Promise<MultipartResult> {
    const contentType = String(ctx.raw.headers['content-type'] ?? '');
    const boundary = boundaryOf(contentType);
    if (!boundary) throw new HttpError(400, 'Expected multipart/form-data.');

    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of ctx.raw) {
        size += (chunk as Buffer).length;
        if (size > MAX_UPLOAD_BYTES) throw new HttpError(413, 'Upload too large.');
        chunks.push(chunk as Buffer);
    }
    const body = Buffer.concat(chunks);
    const delim = Buffer.from(`--${boundary}`);

    const result: MultipartResult = { fields: {}, file: null };

    // Split body on the delimiter; parts sit BETWEEN occurrences.
    let pos = body.indexOf(delim);
    while (pos !== -1) {
        const next = body.indexOf(delim, pos + delim.length);
        if (next === -1) break;
        // Part content spans CRLF after delimiter .. CRLF before next delimiter.
        let partStart = pos + delim.length;
        if (body[partStart] === 0x0d && body[partStart + 1] === 0x0a) partStart += 2;
        let partEnd = next - 2; // strip trailing CRLF belonging to the framing
        if (partEnd < partStart) partEnd = partStart;

        const part = body.slice(partStart, partEnd);
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1 && part.length > 0) {
            // Tolerate parts without a blank line (empty files).
        }
        const headerBlock = headerEnd === -1 ? '' : part.slice(0, headerEnd).toString('utf8');
        const data = headerEnd === -1 ? part : part.slice(headerEnd + 4);

        const disp = dispositionOf(headerBlock);
        if (disp.name) {
            if (disp.filename !== undefined) {
                if (!result.file && data.length > 0) {
                    result.file = { filename: disp.filename, contentType: disp.contentType, data };
                }
            } else {
                result.fields[disp.name] = data.toString('utf8');
            }
        }
        pos = next;
        // Terminal "--boundary--" has no following part; loop exits naturally.
    }
    return result;
}
