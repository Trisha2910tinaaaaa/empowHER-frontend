import React from 'react';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
}

export function PageHeader({ heading, subheading }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
      {subheading && (
        <p className="text-muted-foreground">{subheading}</p>
      )}
    </div>
  );
} 