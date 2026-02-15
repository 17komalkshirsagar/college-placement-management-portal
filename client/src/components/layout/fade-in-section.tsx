'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={cn('transition-all duration-700', isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0', className)}>{children}</div>;
}

