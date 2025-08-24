'use client';

type PostCardProps = {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  published?: boolean;
  authorId?: string;
  authorName?: string;
};

export default function PostCard(props: PostCardProps) {
  // Parse date only if provided
  const created = props.createdAt ? new Date(props.createdAt) : null;

  return (
    <article className="mb-5 break-inside-avoid rounded-2xl border p-4 shadow-sm">
      {/* Meta (author + date) */}
      <div className="flex items-center justify-between text-xs opacity-70 mb-1">
        <span>{props.authorName ?? (props.authorId ? `#${props.authorId}` : 'Unknown')}</span>
        {created && <time dateTime={props.createdAt}>{created.toLocaleDateString()}</time>}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold mb-2 break-words">{props.title}</h3>

      {/* Body: narrow text column for readability */}
      <div className="text-sm leading-relaxed">
        <div className="max-w-[42ch] break-words whitespace-pre-line">
          {props.content}
        </div>
      </div>

      {/* Optional draft badge */}
      {props.published === false && (
        <span className="mt-2 inline-block text-[10px] uppercase tracking-wide opacity-60">Draft</span>
      )}
    </article>
  );
}