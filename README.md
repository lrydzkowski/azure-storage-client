# azure-storage-client

Tools for analyzing the history of operations done by Azure Durable Functions. It allows to get data from tables and containers available in Azure Storage.

## How To Run

It requires Node.js 18.

```powershell
npm install
npm run find -- --from '2023-07-14' --to '2023-07-15' --func-name 'func-import-data-orchestrator' --query 'error'
```
