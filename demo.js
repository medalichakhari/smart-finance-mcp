import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const mcp = new Client(
  {
    name: "finance-demo-client",
    version: "1.0.0",
  },
  { capabilities: {} }
);

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/server.js"],
  stderr: "ignore",
});

async function demo() {
  console.log("Starting Smart Finance Assistant Demo...");

  try {
    await mcp.connect(transport);
    console.log("Connected to MCP server");

    console.log("\nAvailable Resources:");
    const { resources } = await mcp.listResources();
    resources.forEach((resource) => {
      console.log(`  - ${resource.name}: ${resource.description}`);
    });

    console.log("\nGetting Alice's Financial Overview...");

    const accountsResult = await mcp.readResource({ uri: "accounts://all" });
    const accounts = JSON.parse(accountsResult.contents[0].text);
    const aliceAccounts = accounts.filter((acc) => acc.userId === 1);

    console.log("Alice's Accounts:");
    aliceAccounts.forEach((account) => {
      console.log(
        `  - ${account.name} (${account.type}): $${account.balance.toFixed(2)}`
      );
    });

    const transactionsResult = await mcp.readResource({
      uri: "transactions://user/1",
    });
    const transactions = JSON.parse(transactionsResult.contents[0].text);

    console.log(`\nRecent Transactions (${transactions.length} total):`);
    transactions.slice(0, 3).forEach((tx) => {
      const sign = tx.amount >= 0 ? "+" : "";
      console.log(
        `  - ${tx.description}: ${sign}$${tx.amount} (${tx.category})`
      );
    });

    const budgetResult = await mcp.readResource({ uri: "budgets://user/1" });
    const budget = JSON.parse(budgetResult.contents[0].text);

    console.log(`\n📋 Budget: ${budget.name}`);
    console.log(`  Total Budget: $${budget.totalBudget}`);

    console.log("\n📈 Analyzing Alice's Spending Patterns...");
    const spendingAnalysis = await mcp.callTool({
      name: "analyze-spending",
      arguments: { userId: 1, period: "month" },
    });

    console.log("Spending Analysis Results:");
    const analysisData = JSON.parse(spendingAnalysis.content[0].text);
    console.log(
      `  - Total Spending: $${analysisData.totalSpending.toFixed(2)}`
    );
    console.log(`  - Transaction Count: ${analysisData.transactionCount}`);
    console.log(`  - Top Category: ${analysisData.insights.highestCategory}`);

    console.log("\nChecking Budget Status...");
    const budgetStatus = await mcp.callTool({
      name: "check-budget-status",
      arguments: { userId: 1 },
    });

    const statusData = JSON.parse(budgetStatus.content[0].text);
    console.log(`  - Total Budgeted: $${statusData.totalBudgeted}`);
    console.log(`  - Total Spent: $${statusData.totalSpent.toFixed(2)}`);
    console.log(`  - Remaining: $${statusData.totalRemaining.toFixed(2)}`);
    console.log(`  - Budget Used: ${statusData.overallPercentUsed}%`);

    console.log("\nAdding New Transaction...");
    const newTransaction = await mcp.callTool({
      name: "create-transaction",
      arguments: {
        accountId: 1,
        amount: -45.99,
        description: "Coffee Shop Visit",
        category: "entertainment",
        merchant: "Local Coffee House",
        tags: ["coffee", "social"],
      },
    });

    console.log(`${newTransaction.content[0].text}`);

    console.log("\nGenerating AI-Powered Financial Insights...");
    try {
      const insights = await mcp.callTool({
        name: "generate-financial-insights",
        arguments: { userId: 1, focus: "budgeting" },
      });

      console.log("AI Insights:");
      console.log(insights.content[0].text);
    } catch (error) {
      console.log("AI insights require proper configuration (Gemini API key)");
    }

    console.log("\nAvailable Tools:");
    const { tools } = await mcp.listTools();
    tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    console.log("\nDemo completed successfully!");
  } catch (error) {
    console.error("Demo failed:", error.message);
  } finally {
    await mcp.close();
    process.exit(0);
  }
}

demo().catch(console.error);
