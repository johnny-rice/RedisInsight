import React from 'react'
import { render, screen } from 'uiSrc/utils/test-utils'

import TestConnectionsTable from './TestConnectionsTable'

describe('TestConnectionsTable', () => {
  it('should render', () => {
    render(<TestConnectionsTable data={[{ index: 0, status: 'success', endpoint: 'localhost:8080' }]} />)
  })

  it('should not render table for empty data', () => {
    render(<TestConnectionsTable data={[]} />)

    expect(screen.queryByTestId('connections-log-table')).not.toBeInTheDocument()
  })

  it('should render table data with success messages', () => {
    render(
      <TestConnectionsTable data={[
        { index: 0, status: 'success', endpoint: 'localhost:8080' },
        { index: 1, status: 'success', endpoint: 'localhost:8081' },
      ]}
      />
    )

    expect(screen.getByTestId('table-index-0')).toHaveTextContent('(0)')
    expect(screen.getByTestId('table-index-1')).toHaveTextContent('(1)')
    expect(screen.getByTestId('table-endpoint-0')).toHaveTextContent('localhost:8080')
    expect(screen.getByTestId('table-endpoint-1')).toHaveTextContent('localhost:8081')
    expect(screen.getByTestId('table-result-0')).toHaveTextContent('Successful')
    expect(screen.getByTestId('table-result-1')).toHaveTextContent('Successful')
  })

  it('should render table data with error messages', () => {
    render(
      <TestConnectionsTable data={[
        { index: 0, status: 'error', endpoint: 'localhost:8080', error: 'error' },
      ]}
      />
    )
    expect(screen.getByTestId('table-result-0')).toHaveTextContent('error')
  })
})
