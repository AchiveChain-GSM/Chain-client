// src/components/postDetail/PostContent.jsx
function unescapeHtml(str) {
  if (!str) return '';
  // &lt; &gt; &amp; 등을 실제 문자로 복구
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

export default function PostContent({ html, post, postData }) {
  const p = post ?? postData ?? {};
  let safeHtml = html ?? p.content ?? '';

  // ✅ 서버가 &lt;p&gt; 처럼 escape해서 내려주면 복구
  if (typeof safeHtml === 'string' && safeHtml.includes('&lt;')) {
    safeHtml = unescapeHtml(safeHtml);
  }

  return (
    <div
      className="ProseMirror mb-8 text-[16px] text-white leading-relaxed"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
