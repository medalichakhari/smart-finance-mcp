import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new McpServer({
  name: "smart-finance-assistant",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// === FINANCIAL RESOURCES ===

// Financial Accounts Resource
server.resource(
  "accounts",
  "accounts://all",
  {
    description: "Get all financial accounts data",
    title: "Financial Accounts",
    mimeType: "application/json",
  },
  async (uri: any) => {
    const accounts = await import("./data/accounts.json", {
      with: { type: "json" },
    }).then((m) => m.default);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(accounts),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "account-details",
  new ResourceTemplate("accounts://{accountId}/details", { list: undefined }),
  {
    description: "Get specific account details",
    title: "Account Details",
    mimeType: "application/json",
  },
  async (uri: any, { accountId }: any) => {
    const accounts = await import("./data/accounts.json", {
      with: { type: "json" },
    }).then((m) => m.default);
    const account = accounts.find(
      (a: any) => a.id === parseInt(accountId as string)
    );

    if (account == null) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: "Account not found" }),
            mimeType: "application/json",
          },
        ],
      };
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(account),
          mimeType: "application/json",
        },
      ],
    };
  }
);

// Transactions Resource
server.resource(
  "transactions",
  "transactions://all",
  {
    description: "Get all transactions data",
    title: "Transactions",
    mimeType: "application/json",
  },
  async (uri: any) => {
    const transactions = await import("./data/transactions.json", {
      with: { type: "json" },
    }).then((m) => m.default);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(transactions),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "user-transactions",
  new ResourceTemplate("transactions://user/{userId}", { list: undefined }),
  {
    description: "Get transactions for a specific user",
    title: "User Transactions",
    mimeType: "application/json",
  },
  async (uri: any, { userId }: any) => {
    const transactions = await import("./data/transactions.json", {
      with: { type: "json" },
    }).then((m) => m.default);
    const userTransactions = transactions.filter(
      (t: any) => t.userId === parseInt(userId as string)
    );

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(userTransactions),
          mimeType: "application/json",
        },
      ],
    };
  }
);

// Budgets Resource
server.resource(
  "budgets",
  "budgets://all",
  {
    description: "Get all budget data",
    title: "Budgets",
    mimeType: "application/json",
  },
  async (uri: any) => {
    const budgets = await import("./data/budgets.json", {
      with: { type: "json" },
    }).then((m) => m.default);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(budgets),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "user-budget",
  new ResourceTemplate("budgets://user/{userId}", { list: undefined }),
  {
    description: "Get budget for a specific user",
    title: "User Budget",
    mimeType: "application/json",
  },
  async (uri: any, { userId }: any) => {
    const budgets = await import("./data/budgets.json", {
      with: { type: "json" },
    }).then((m) => m.default);
    const userBudget = budgets.find(
      (b: any) => b.userId === parseInt(userId as string) && b.isActive
    );

    if (userBudget == null) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: "Active budget not found for user" }),
            mimeType: "application/json",
          },
        ],
      };
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(userBudget),
          mimeType: "application/json",
        },
      ],
    };
  }
);

// Users Resource (existing)
server.resource(
  "users",
  "users://all",
  {
    description: "Get all users data from the database",
    title: "Users",
    mimeType: "application/json",
  },
  async (uri: any) => {
    const users = await import("./data/users.json", {
      with: { type: "json" },
    }).then((m) => m.default);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(users),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "user-details",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  {
    description: "Get a user's details from the database",
    title: "User Details",
    mimeType: "application/json",
  },
  async (uri: any, { userId }: any) => {
    const users = await import("./data/users.json", {
      with: { type: "json" },
    }).then((m) => m.default);
    const user = users.find((u: any) => u.id === parseInt(userId as string));

    if (user == null) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: "User not found" }),
            mimeType: "application/json",
          },
        ],
      };
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(user),
          mimeType: "application/json",
        },
      ],
    };
  }
);

// === FINANCIAL TOOLS ===

// Create Transaction Tool
server.tool(
  "create-transaction",
  "Create a new financial transaction",
  {
    accountId: z.number().describe("ID of the account for this transaction"),
    amount: z
      .number()
      .describe(
        "Transaction amount (negative for expenses, positive for income)"
      ),
    description: z.string().describe("Description of the transaction"),
    category: z
      .string()
      .describe(
        "Category of the transaction (e.g., groceries, utilities, income)"
      ),
    merchant: z.string().optional().describe("Merchant or payee name"),
    tags: z.array(z.string()).optional().describe("Tags for the transaction"),
    isRecurring: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether this is a recurring transaction"),
  },
  {
    title: "Create Transaction",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params: any) => {
    try {
      const id = await createTransaction(params);
      return {
        content: [
          { type: "text", text: `Transaction ${id} created successfully` },
        ],
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Failed to create transaction: ${error}` },
        ],
      };
    }
  }
);

// Create Financial Account Tool
server.tool(
  "create-account",
  "Create a new financial account",
  {
    userId: z.number().describe("ID of the user who owns this account"),
    name: z.string().describe("Name of the account"),
    type: z
      .enum(["checking", "savings", "credit", "investment"])
      .describe("Type of account"),
    balance: z.number().describe("Initial balance"),
    bankName: z.string().describe("Name of the bank or financial institution"),
    accountNumber: z
      .string()
      .optional()
      .describe("Account number (will be masked for security)"),
  },
  {
    title: "Create Financial Account",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params: any) => {
    try {
      const id = await createAccount(params);
      return {
        content: [{ type: "text", text: `Account ${id} created successfully` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to create account: ${error}` }],
      };
    }
  }
);

// Financial Analysis Tool
server.tool(
  "analyze-spending",
  "Analyze spending patterns for a user",
  {
    userId: z.number().describe("ID of the user to analyze"),
    period: z
      .enum(["week", "month", "quarter", "year"])
      .optional()
      .default("month")
      .describe("Analysis period"),
  },
  {
    title: "Analyze Spending",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  async (params: any) => {
    try {
      const analysis = await analyzeSpending(params.userId, params.period);
      return {
        content: [{ type: "text", text: JSON.stringify(analysis, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Failed to analyze spending: ${error}` },
        ],
      };
    }
  }
);

// Budget Status Tool
server.tool(
  "check-budget-status",
  "Check budget status and spending against budget categories",
  {
    userId: z.number().describe("ID of the user to check budget for"),
  },
  {
    title: "Check Budget Status",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  async (params: any) => {
    try {
      const status = await checkBudgetStatus(params.userId);
      return {
        content: [{ type: "text", text: JSON.stringify(status, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Failed to check budget status: ${error}` },
        ],
      };
    }
  }
);

// AI-Powered Financial Insights Tool
server.tool(
  "generate-financial-insights",
  "Generate AI-powered financial insights and recommendations",
  {
    userId: z.number().describe("ID of the user to generate insights for"),
    focus: z
      .enum(["spending", "saving", "budgeting", "general"])
      .optional()
      .default("general")
      .describe("Focus area for insights"),
  },
  {
    title: "Generate Financial Insights",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params: any) => {
    try {
      const insights = await generateFinancialInsights(
        params.userId,
        params.focus
      );
      return {
        content: [{ type: "text", text: insights }],
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Failed to generate insights: ${error}` },
        ],
      };
    }
  }
);

// Existing user tools
server.tool(
  "create-user",
  "Create a new user in the database",
  {
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  },
  {
    title: "Create User",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params: any) => {
    try {
      const id = await createUser(params);
      return {
        content: [{ type: "text", text: `User ${id} created successfully` }],
      };
    } catch {
      return {
        content: [{ type: "text", text: "Failed to save user" }],
      };
    }
  }
);

server.tool(
  "create-random-user",
  "Create a random user with fake data",
  {},
  {
    title: "Create Random User",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async () => {
    const res = await server.server.request(
      {
        method: "sampling/createMessage",
        params: {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: "Generate fake user data. The user should have a realistic name, email, address, and phone number. Return this data as a JSON object with no other text or formatter so it can be used with JSON.parse.",
              },
            },
          ],
          maxTokens: 1024,
        },
      },
      CreateMessageResultSchema
    );

    if (res.content.type !== "text") {
      return {
        content: [{ type: "text", text: "Failed to generate user data" }],
      };
    }

    try {
      const fakeUser = JSON.parse(
        res.content.text
          .trim()
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim()
      );

      const id = await createUser(fakeUser);
      return {
        content: [{ type: "text", text: `User ${id} created successfully` }],
      };
    } catch {
      return {
        content: [{ type: "text", text: "Failed to generate user data" }],
      };
    }
  }
);

// === PROMPTS ===

server.prompt(
  "generate-fake-user",
  "Generate a fake user based on a given name",
  {
    name: z.string(),
  },
  ({ name }: any) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a fake user with the name ${name}. The user should have a realistic email, address, and phone number.`,
          },
        },
      ],
    };
  }
);

server.prompt(
  "financial-advice",
  "Generate personalized financial advice based on user data",
  {
    userId: z.string().describe("ID of the user to generate advice for"),
    focus: z
      .string()
      .optional()
      .describe(
        "Specific area to focus on (e.g., budgeting, saving, investing)"
      ),
  },
  ({ userId, focus }: any) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Analyze the financial data for user ${userId} and provide personalized financial advice${
              focus ? ` with focus on ${focus}` : ""
            }. Consider their spending patterns, budget adherence, and account balances to give actionable recommendations.`,
          },
        },
      ],
    };
  }
);

server.prompt(
  "budget-optimization",
  "Generate budget optimization suggestions",
  {
    userId: z.string().describe("ID of the user to optimize budget for"),
  },
  ({ userId }: any) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Analyze user ${userId}'s current budget and spending patterns. Suggest optimizations to help them save more money while maintaining their lifestyle. Identify categories where they can reduce spending and suggest realistic budget adjustments.`,
          },
        },
      ],
    };
  }
);

// === HELPER FUNCTIONS ===

async function createUser(user: {
  name: string;
  email: string;
  address: string;
  phone: string;
}) {
  const users = await import("./data/users.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const id = users.length + 1;
  users.push({ id, ...user });
  await fs.writeFile("./src/data/users.json", JSON.stringify(users, null, 2));
  return id;
}

async function createTransaction(transaction: {
  accountId: number;
  amount: number;
  description: string;
  category: string;
  merchant?: string;
  tags?: string[];
  isRecurring?: boolean;
}) {
  const transactions = await import("./data/transactions.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const accounts = await import("./data/accounts.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const account = accounts.find((a: any) => a.id === transaction.accountId);
  if (!account) {
    throw new Error("Account not found");
  }

  const id = transactions.length + 1;
  const newTransaction = {
    id,
    ...transaction,
    userId: account.userId,
    type: transaction.amount >= 0 ? "income" : "expense",
    date: new Date().toISOString(),
    merchant: transaction.merchant || "Unknown",
    tags: transaction.tags || [],
    isRecurring: transaction.isRecurring || false,
  };

  transactions.push(newTransaction);
  await fs.writeFile(
    "./src/data/transactions.json",
    JSON.stringify(transactions, null, 2)
  );

  // Update account balance
  account.balance += transaction.amount;
  await fs.writeFile(
    "./src/data/accounts.json",
    JSON.stringify(accounts, null, 2)
  );

  return id;
}

async function createAccount(account: {
  userId: number;
  name: string;
  type: string;
  balance: number;
  bankName: string;
  accountNumber?: string;
}) {
  const accounts = await import("./data/accounts.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const id = accounts.length + 1;
  const newAccount = {
    id,
    ...account,
    accountNumber: account.accountNumber
      ? `****${account.accountNumber.slice(-4)}`
      : "****0000",
    isActive: true,
    createdAt: new Date().toISOString(),
    currency: "USD",
  };

  accounts.push(newAccount);
  await fs.writeFile(
    "./src/data/accounts.json",
    JSON.stringify(accounts, null, 2)
  );
  return id;
}

async function analyzeSpending(userId: number, period: string) {
  const transactions = await import("./data/transactions.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const userTransactions = transactions.filter((t: any) => t.userId === userId);

  // Calculate date range based on period
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      startDate = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const periodTransactions = userTransactions.filter(
    (t: any) => new Date(t.date) >= startDate && t.type === "expense"
  );

  // Calculate spending by category
  const categorySpending: Record<string, number> = {};
  let totalSpending = 0;

  periodTransactions.forEach((t: any) => {
    const amount = Math.abs(t.amount);
    categorySpending[t.category] = (categorySpending[t.category] || 0) + amount;
    totalSpending += amount;
  });

  // Find top spending categories
  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    period,
    totalSpending,
    transactionCount: periodTransactions.length,
    averageTransaction: totalSpending / periodTransactions.length || 0,
    categoryBreakdown: categorySpending,
    topSpendingCategories: topCategories,
    insights: {
      highestCategory: topCategories[0]?.[0] || "None",
      dailyAverage:
        totalSpending /
        (period === "week"
          ? 7
          : period === "month"
          ? 30
          : period === "quarter"
          ? 90
          : 365),
    },
  };
}

async function checkBudgetStatus(userId: number) {
  const budgets = await import("./data/budgets.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const userBudget = budgets.find(
    (b: any) => b.userId === userId && b.isActive
  );
  if (!userBudget) {
    throw new Error("No active budget found for user");
  }

  const transactions = await import("./data/transactions.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  // Calculate current spending for budget period
  const startDate = new Date(userBudget.startDate);
  const endDate = new Date(userBudget.endDate);

  const periodTransactions = transactions.filter(
    (t: any) =>
      t.userId === userId &&
      t.type === "expense" &&
      new Date(t.date) >= startDate &&
      new Date(t.date) <= endDate
  );

  const actualSpending: Record<string, number> = {};
  periodTransactions.forEach((t: any) => {
    const amount = Math.abs(t.amount);
    actualSpending[t.category] = (actualSpending[t.category] || 0) + amount;
  });

  // Compare with budget
  const categoryStatus: Record<string, any> = {};
  let totalBudgeted = 0;
  let totalSpent = 0;

  Object.entries(userBudget.categories).forEach(
    ([category, budget]: [string, any]) => {
      const spent = actualSpending[category] || 0;
      const remaining = budget.budgeted - spent;
      const percentUsed = (spent / budget.budgeted) * 100;

      categoryStatus[category] = {
        budgeted: budget.budgeted,
        spent,
        remaining,
        percentUsed: Math.round(percentUsed * 100) / 100,
        status:
          percentUsed > 100 ? "over" : percentUsed > 80 ? "warning" : "good",
      };

      totalBudgeted += budget.budgeted;
      totalSpent += spent;
    }
  );

  return {
    budgetName: userBudget.name,
    period: `${userBudget.startDate} to ${userBudget.endDate}`,
    totalBudgeted,
    totalSpent,
    totalRemaining: totalBudgeted - totalSpent,
    overallPercentUsed: Math.round((totalSpent / totalBudgeted) * 10000) / 100,
    categoryStatus,
    overBudgetCategories: Object.entries(categoryStatus).filter(
      ([, status]: [string, any]) => status.status === "over"
    ),
    warningCategories: Object.entries(categoryStatus).filter(
      ([, status]: [string, any]) => status.status === "warning"
    ),
  };
}

async function generateFinancialInsights(userId: number, focus: string) {
  try {
    const [analysis, budgetStatus] = await Promise.all([
      analyzeSpending(userId, "month"),
      checkBudgetStatus(userId),
    ]);

    const res = await server.server.request(
      {
        method: "sampling/createMessage",
        params: {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Analyze this financial data and provide actionable insights focused on ${focus}:

Spending Analysis: ${JSON.stringify(analysis, null, 2)}

Budget Status: ${JSON.stringify(budgetStatus, null, 2)}

Please provide:
1. Key insights about spending patterns
2. Specific recommendations for improvement
3. Potential areas of concern
4. Actionable next steps

Keep the response concise but valuable.`,
              },
            },
          ],
          maxTokens: 1024,
        },
      },
      CreateMessageResultSchema
    );

    if (res.content.type !== "text") {
      return "Failed to generate financial insights";
    }

    return res.content.text;
  } catch (error) {
    return `Error generating insights: ${error}`;
  }
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
