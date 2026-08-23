import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc, html, unsafe } from '../../src/core/04-html';

test('esc() neutralizes every dangerous character', () => {
    assert.equal(
        esc('<script>alert("x")</script>'),
        '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    );
    assert.equal(esc("O'Brien & Sons <3"), 'O&#39;Brien &amp; Sons &lt;3');
});

test('html`` escapes interpolations but keeps literal markup', () => {
    const out = html`<p class="greet">Hi ${'<img src=x onerror=alert(1)>'}</p>`;
    assert.equal(out.value, '<p class="greet">Hi &lt;img src=x onerror=alert(1)&gt;</p>');
});

test('falsy interpolations vanish, enabling conditional fragments', () => {
    const show = false;
    const out = html`<div>${show && html`<b>never</b>`}<span>always</span></div>`;
    assert.equal(out.value, '<div><span>always</span></div>');
});

test('arrays of fragments flatten in order', () => {
    const items = ['a', 'b'];
    const out = html`<ul>
        ${items.map((i) => html`<li>${i}</li>`)}
    </ul>`;
    assert.equal(out.value, '<ul><li>a</li><li>b</li></ul>');
});

test('unsafe() passes trusted markup verbatim (and only that)', () => {
    const out = html`<div>${unsafe('<hr />')}</div>`;
    assert.equal(out.value, '<div><hr /></div>');
});
