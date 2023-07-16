# azure-storage-client

Tools for analyzing the history of operations done by Azure Durable Functions. It allows to get data from tables and containers available in Azure Storage.

## Requirements

Node.js 18

## How To Run

1. Create `.env` file based on `.env.sample`.
2. Install dependencies:

    ```powershell
    npm install
    ```

3. Run a command like in the following example:

    ```powershell
    npm run find -- --from '2023-07-14' --to '2023-07-15' --func-name 'func-import-data-orchestrator' --query 'error'
    ```

4. If there are any operations that fulfill the query, then you can find them in `find/files/` directory.
