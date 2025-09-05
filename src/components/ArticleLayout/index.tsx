import React from 'react';
import './index.css';
import type { RSSItem } from '../../types/rss';

interface ArticleLayoutProps {
  article: RSSItem;
  index: number;
  children: {
    image?: React.ReactNode;
    title: React.ReactNode;
    titleActions: React.ReactNode;
    meta: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
  };
}

export function ArticleLayout({
  article,
  index,
  children,
}: ArticleLayoutProps) {
  return (
    <article key={`${article.link}-${index}`} className="article-card">
      {children.image}
      <div className="article-title-actions">{children.titleActions}</div>
      <div className="article-content">
        <div className="article-header">
          <h2 className="article-title">{children.title}</h2>

          <div className="article-meta">
            {children.meta}
            {children.actions}
          </div>
        </div>

        {children.description}
      </div>
    </article>
  );
}
