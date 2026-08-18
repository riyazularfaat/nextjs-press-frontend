import React from 'react';

export default function BlogLayout({ 
  children, 
}: { 
  children: React.ReactNode 
}) { 
  return ( 
    <div> 
      <h1>My Blog Post layout</h1>
      { children } 
    </div> 
  ); 
}
