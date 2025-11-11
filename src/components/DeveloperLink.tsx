import React from 'react';

const getDeveloperLink = () => {
  const developerUrl = process.env.DEVELOPED_BY;
  if (!developerUrl) {
    return null;
  }
  return developerUrl;
};

const getDeveloperDomain = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const DeveloperLink: React.FC = () => {
  const developerLink = getDeveloperLink();

  if (!developerLink) {
    return null;
  }

  return (
    <div className="text-xs text-gray-400/60" style={{ fontFamily: 'Inter, sans-serif' }}>
      <a
        href={developerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500/80 hover:text-gray-700 hover:underline transition-colors duration-200 font-medium"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {getDeveloperDomain(developerLink)}
      </a>
    </div>
  );
};

