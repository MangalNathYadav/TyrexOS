"use client";

interface WebBrowserProps {
  url: string;
  title: string;
}

export default function WebBrowser({ url, title }: WebBrowserProps) {
  return (
    <div className="w-full h-full bg-black relative rounded-b-lg overflow-hidden">
      <iframe
        src={url}
        className="w-full h-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={title}
      />
    </div>
  );
}
