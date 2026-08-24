/**
 * MAIN SITE ROUTES - public pages + auth + submission intake.
 *
 * SECURITY POSTURE (parity with the hardened Next build):
 *   - /login and /submission are public pages.
 *   - POST /api/auth/login  -> bcrypt verify, rate-limited, sets signed cookie
 *   - GET  /api/auth/logout -> destroys session, redirects home
 *   - POST /api/submission  -> rate-limited, zod-validated, multipart upload,
 *                              writes pending row + domain flags + screenshot
 */

import { Application } from "../core/01-application";
import { Context } from "../core/03-context";
import { HttpError } from "../core/09-errors";
import { mainSessions } from "./guards";
import { render } from "../core/views";
import { loginSchema } from "../lib/validations/admin-auth";
import { submissionSchema } from "../lib/validations/submission";
import { rateLimit } from "../lib/rate-limit";
import { readMultipart } from "../lib/multipart";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
    createSubmission,
    createDomain,
    getNextSubmissionId,
    type CreateDomainInput,
} from "../server/queries/submissions";
import { mainDb } from "../lib/db/main";
import bcrypt from "bcryptjs";

export function registerMainSiteRoutes(app: Application): void {
    app.get("/login", async (ctx) => {
        ctx.htmlRaw(render("login", {}));
    });

    app.post(
        "/api/auth/login",
        async (ctx) => {
            if (!rateLimit("main-login:" + ctx.ip, 10, 60_000)) {
                throw new HttpError(429, "Too many login attempts. Try again in a minute.");
            }
            const form = await ctx.body(loginSchema);
            const user = await mainDb.login.findUnique({ where: { User: form.username } });
            const valid = user !== null && (await bcrypt.compare(form.password, user.PW));
            // Same generic error for unknown-user and bad-password: never hint
            // which half was wrong (credential-stuffing resistance).
            if (!valid) throw new HttpError(401, "Invalid username or password.");
            await mainSessions.save(ctx, { islogin: true });
            ctx.redirect("/admin");
        },
        { guard: undefined }
    );

    app.get("/api/auth/logout", async (ctx) => {
        mainSessions.destroy(ctx);
        ctx.redirect("/");
    });

    app.get("/submission", async (ctx) => {
        ctx.htmlRaw(render("submission", {}));
    });

    app.post("/api/submission", async (ctx: Context) => {
        if (!rateLimit("submission:" + ctx.ip, 5, 3_600_000)) {
            throw new HttpError(429, "Too many submissions. Try again later.");
        }

        const { fields, file } = await readMultipart(ctx);
        const parsed = submissionSchema.safeParse(fields);
        if (!parsed.success) {
            throw new HttpError(400, parsed.error.issues[0]?.message ?? "Validation failed.");
        }

        const id = await getNextSubmissionId();
        const d = parsed.data;
        const row = await createSubmission({
            id,
            techname: d.techname,
            link: d.link,
            displaytext: d.displaytext,
            tl1_desc: d.tl1_desc ?? "",
            tl2_desc: d.tl2_desc ?? "",
            tl3_desc: d.tl3_desc ?? "",
            tl4_desc: d.tl4_desc ?? "",
            username: d.username ?? "",
            contact: d.contact ?? "",
            accepted: false,
        });

        const domainFlags = (
            [
                "R",
                "TP",
                "MT",
                "AR",
                "U",
                "MDL",
                "RA",
                "RoTech",
                "LS",
                "RoThink",
                "EoST",
                "EF",
                "RTE",
                "DLoI",
                "RaAoC",
            ] as const
        ).map((col) => [col, fields[col] === "true"]) as Array<[keyof CreateDomainInput, boolean]>;
        await createDomain({ id, ...Object.fromEntries(domainFlags) } as CreateDomainInput);

        if (file && file.data.length > 0) {
            const dir = path.join(process.cwd(), "public", "testuploads");
            await mkdir(dir, { recursive: true });
            const ext = path.extname(file.filename || "") || ".png";
            await writeFile(path.join(dir, `${id}${ext}`), file.data);
        }

        ctx.json({ success: true, id: row.id, message: "Submission received." });
    });
}
