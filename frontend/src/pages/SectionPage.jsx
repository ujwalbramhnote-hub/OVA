import React from 'react';
import Card from '../components/ui/Card';

const SectionPage = ({ title, description }) => (
  <Card className="p-6 md:p-8">
    <p className="text-xs uppercase tracking-[0.24em] text-muted-theme">VoteChain</p>
    <h1 className="mt-3 text-3xl font-semibold text-primary-theme">{title}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary-theme">{description}</p>
  </Card>
);

export default SectionPage;
