import * as React from 'react'
import classNames from 'classnames'
import { Button } from '../lib/button'
import {
  Popover,
  PopoverAnchorPosition,
  PopoverDecoration,
} from '../lib/popover'
import { Select } from '../lib/select'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'

export interface ICommitAuthorFilter {
  readonly name: string
  readonly email: string
}

interface ICommitGraphFilterButtonProps {
  readonly authors: ReadonlyArray<ICommitAuthorFilter>
  readonly selectedAuthorEmail: string | null
  readonly onAuthorChanged: (email: string | null) => void
}

interface ICommitGraphFilterButtonState {
  readonly isFilterOptionsOpen: boolean
}

export class CommitGraphFilterButton extends React.Component<
  ICommitGraphFilterButtonProps,
  ICommitGraphFilterButtonState
> {
  private filterOptionsButtonRef: HTMLButtonElement | null = null

  public constructor(props: ICommitGraphFilterButtonProps) {
    super(props)

    this.state = {
      isFilterOptionsOpen: false,
    }
  }

  private onFilterOptionsButtonRef = (buttonRef: HTMLButtonElement | null) => {
    this.filterOptionsButtonRef = buttonRef
  }

  private toggleFilterOptionsOpen = () => {
    this.setState(prevState => ({
      isFilterOptionsOpen: !prevState.isFilterOptionsOpen,
    }))
  }

  private closeFilterOptions = () => {
    this.setState({ isFilterOptionsOpen: false })
  }

  private onAuthorChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    const email = event.currentTarget.value
    this.props.onAuthorChanged(email === '' ? null : email)
  }

  private renderFilterOptions() {
    return (
      <Popover
        className="filter-popover"
        ariaLabelledby="filter-options-header"
        anchor={this.filterOptionsButtonRef}
        anchorPosition={PopoverAnchorPosition.BottomRight}
        decoration={PopoverDecoration.Balloon}
        onMousedownOutside={this.closeFilterOptions}
        onClickOutside={this.closeFilterOptions}
      >
        <div className="filter-popover-header">
          <h3 id="filter-options-header">Filter Options</h3>
          <button
            className="close"
            onClick={this.closeFilterOptions}
            aria-label="Close"
          >
            <Octicon symbol={octicons.x} />
          </button>
        </div>
        <div className="filter-options">
          <Select
            label="Author"
            value={this.props.selectedAuthorEmail ?? ''}
            onChange={this.onAuthorChanged}
          >
            <option value="">All authors</option>
            {this.props.authors.map(({ name, email }) => (
              <option key={email} value={email}>
                {name ? `${name} <${email}>` : email}
              </option>
            ))}
          </Select>
        </div>
      </Popover>
    )
  }

  public render() {
    const hasActiveFilter = this.props.selectedAuthorEmail !== null
    const buttonTextLabel = `Filter Options ${
      hasActiveFilter ? '(1 applied)' : ''
    }`

    return (
      <>
        <Button
          className={classNames('filter-button', {
            active: hasActiveFilter,
          })}
          onClick={this.toggleFilterOptionsOpen}
          ariaExpanded={this.state.isFilterOptionsOpen}
          onButtonRef={this.onFilterOptionsButtonRef}
          tooltip={buttonTextLabel}
          ariaLabel={buttonTextLabel}
        >
          <span>
            <Octicon symbol={octicons.filter} />
          </span>
          {hasActiveFilter ? (
            <span className="active-badge">
              <span className="badge-bg">
                <span className="badge" />
              </span>
            </span>
          ) : null}
          <Octicon symbol={octicons.triangleDown} />
        </Button>
        {this.state.isFilterOptionsOpen && this.renderFilterOptions()}
      </>
    )
  }
}
