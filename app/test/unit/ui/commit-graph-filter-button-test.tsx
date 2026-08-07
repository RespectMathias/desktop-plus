import assert from 'node:assert'
import { describe, it } from 'node:test'
import * as React from 'react'
import { CommitGraphFilterButton } from '../../../src/ui/history/commit-graph-filter-button'
import { fireEvent, render, screen } from '../../helpers/ui/render'

describe('CommitGraphFilterButton', () => {
  const authors = [
    { name: 'Ada Lovelace', email: 'ada@example.com' },
    { name: 'Grace Hopper', email: 'grace@example.com' },
  ]

  it('selects one author from filter options', () => {
    let selectedAuthorEmail: string | null = null
    const onAuthorChanged = (email: string | null) => {
      selectedAuthorEmail = email
    }

    render(
      <CommitGraphFilterButton
        authors={authors}
        selectedAuthorEmail={null}
        onAuthorChanged={onAuthorChanged}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /filter options/i }))
    const select = screen.getByLabelText('Author')
    fireEvent.change(select, { target: { value: 'grace@example.com' } })

    assert.equal(selectedAuthorEmail, 'grace@example.com')
  })

  it('shows active filter state and supports clearing selection', () => {
    let selectedAuthorEmail: string | null = 'ada@example.com'
    const onAuthorChanged = (email: string | null) => {
      selectedAuthorEmail = email
    }

    render(
      <CommitGraphFilterButton
        authors={authors}
        selectedAuthorEmail={selectedAuthorEmail}
        onAuthorChanged={onAuthorChanged}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: /filter options \(1 applied\)/i })
    )
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: '' } })

    assert.equal(selectedAuthorEmail, null)
  })
})
