/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import OverviewJamCard from '../components/OverviewJamCard';
import client from 'next-auth/client';
import '@testing-library/jest-dom';

jest.mock('next-auth/client');

beforeAll(() => {
  const mockSession = {
    expires: '1',
    user: { email: 'jam', name: 'jam' },
  };

  client.useSession.mockReturnValueOnce([mockSession, false]);
});

const jamData = {
  name: 'My jam is cool',
  isOpen: true,
  createdAt: 'dummyDate',
};

describe('OverviewJamCard', () => {
  it('renders a card with a name', () => {
    const { getByText } = render(
      <OverviewJamCard
        isOpen={jamData.isOpen}
        jamName={jamData.name}
        createdAt={jamData.createdAt}
      />,
    );

    expect(getByText('My jam is cool')).toBeTruthy();
    expect(getByText('Open')).toBeTruthy();
  });
});
