/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import Index from '../pages/index'

describe('App', () => {
  it('renders a heading', () => {
    const { getByRole } = render(<Index />)

    const heading = getByRole('heading', {
      name: /welcome to jam/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
