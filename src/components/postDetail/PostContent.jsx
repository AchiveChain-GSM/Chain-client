export default function PostContent({ html, post, postData }) {
  const p = post ?? postData ?? {};
  const safeHtml = html ?? p.content ?? '';

  return (
    <div
      className="ProseMirror mb-8 text-[16px] text-white leading-relaxed"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
