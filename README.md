# Smart Personal Finance Assistant MCP Server

## 🎯 Overview

This is an enhanced MCP (Model Context Protocol) server that has been transformed from a basic user management system into a comprehensive **Smart Personal Finance Assistant**. It provides intelligent financial management capabilities with AI-powered insights, making it a perfect example of how MCP servers can be used to create sophisticated, data-driven applications.

## ✨ What Makes This Special

- **🤖 AI-Powered**: Leverages LLM capabilities for intelligent financial insights
- **📊 Real-time Analysis**: Live budget monitoring and spending analysis
- **🔗 MCP Architecture**: Demonstrates advanced MCP server/client patterns
- **💡 Extensible Design**: Built for easy expansion and customization
- **📈 Production Ready**: Robust data structures and error handling

## 🚀 Key Features

### Financial Data Management

- **Multi-Account Support**: Track checking, savings, credit, and investment accounts
- **Smart Transaction Tracking**: Categorized transactions with tags and merchant info
- **Budget Management**: Category-based budgets with real-time tracking
- **User Management**: Multi-user support with isolated financial data

### Intelligent Analysis Tools

- **Spending Pattern Analysis**: Analyze trends across multiple time periods
- **Budget vs. Actual Monitoring**: Real-time comparisons with alerts
- **AI-Powered Insights**: Personalized financial recommendations
- **Category Breakdowns**: Detailed spending analysis by category

### Advanced MCP Capabilities

- **7 Rich Resources**: Access financial data through intuitive URIs
- **7 Powerful Tools**: Execute financial operations and analysis
- **3 Smart Prompts**: Generate AI-powered advice and optimizations
- **Real-time Updates**: Live data synchronization across all operations

## 📋 MCP Resources, Tools & Prompts

### 📊 Resources (7 Available)

| Resource               | URI Pattern                               | Description                    |
| ---------------------- | ----------------------------------------- | ------------------------------ |
| **Financial Accounts** | `accounts://all`                          | Get all financial accounts     |
| **Account Details**    | `accounts://{accountId}/details`          | Get specific account details   |
| **All Transactions**   | `transactions://all`                      | Get all transaction data       |
| **User Transactions**  | `transactions://user/{userId}`            | Get user-specific transactions |
| **All Budgets**        | `budgets://all`                           | Get all budget data            |
| **User Budget**        | `budgets://user/{userId}`                 | Get active user budget         |
| **User Management**    | `users://all`, `users://{userId}/profile` | User data and profiles         |

### 🛠️ Tools (7 Available)

| Tool                            | Purpose                        | Key Parameters                                   |
| ------------------------------- | ------------------------------ | ------------------------------------------------ |
| **create-transaction**          | Add new financial transactions | `accountId`, `amount`, `description`, `category` |
| **create-account**              | Create new financial accounts  | `userId`, `name`, `type`, `balance`, `bankName`  |
| **analyze-spending**            | Analyze spending patterns      | `userId`, `period` (week/month/quarter/year)     |
| **check-budget-status**         | Monitor budget adherence       | `userId`                                         |
| **generate-financial-insights** | AI-powered financial advice    | `userId`, `focus` (spending/saving/budgeting)    |
| **create-user**                 | User management                | `name`, `email`, `address`, `phone`              |
| **create-random-user**          | Generate test users            | _(no parameters)_                                |

### 💡 Prompts (3 Available)

| Prompt                  | Purpose                                | Parameters                   |
| ----------------------- | -------------------------------------- | ---------------------------- |
| **financial-advice**    | Generate personalized financial advice | `userId`, `focus` (optional) |
| **budget-optimization** | Suggest budget improvements            | `userId`                     |
| **generate-fake-user**  | Create test user data                  | `name`                       |

## 📊 Sample Data Included

The project comes with realistic sample data to demonstrate all features:

### 👤 Users

- **Alice Johnson** (ID: 1) - Personal finance user with complete financial profile
- **Bob Smith** (ID: 2) - Business user with business accounts and expenses
- **Charlie Brown** (ID: 3) - Additional test user for multi-user scenarios

### 💳 Financial Accounts

- **Alice's Primary Checking**: $2,850.75 (First National Bank)
- **Alice's Savings Account**: $15,420.30 (First National Bank)
- **Bob's Business Checking**: $8,932.45 (Business Bank Corp)

### 💸 Sample Transactions (Categorized & Tagged)

- **Personal Expenses**: Groceries ($45.32), Rent ($1,200), Utilities ($85.50)
- **Income**: Salary deposits ($3,500), transfers, and other income sources
- **Business Expenses**: Various business-related transactions
- **All transactions include**: Merchant info, categories, tags, and recurring flags

### 📋 Budget Categories (Real-world Examples)

- **Personal**: Housing, groceries, utilities, transportation, entertainment, healthcare
- **Business**: Office supplies, marketing, software, travel, equipment
- **Smart Tracking**: Real-time spending vs. budget with percentage tracking

## 🛠️ Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Optional: Gemini API key for AI features

### Installation & Setup

```bash
# Clone or navigate to the project directory
cd mcp-server-and-client

# Install dependencies
npm install

# Build the project
npm run server:build
```

### 🚀 Running the Application

#### Option 1: MCP Inspector (Recommended for Testing)

```bash
npm run server:inspect
```

- Opens interactive web interface at `http://127.0.0.1:6274`
- Best for exploring resources, testing tools, and seeing data
- No coding required - point-and-click interface

#### Option 2: Interactive Client

```bash
npm run client:dev
```

- Command-line interface with menu-driven options
- Great for understanding MCP client/server communication
- Supports all tools, resources, and prompts

#### Option 3: Programmatic Demo

```bash
npm run demo
```

- Automated demonstration of key features
- Shows practical usage examples
- Perfect for understanding the API

#### Option 4: Development Server Only

```bash
npm run server:dev
```

- Runs just the MCP server
- Use with custom clients or external tools
- Server listens on stdio transport

### 🔧 Configuration

#### Environment Variables

Create a `.env` file in the project root:

```env
# Optional: For AI-powered insights
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Data Persistence

- All financial data is stored in JSON files under `src/data/`
- Changes persist across server restarts
- Easy to backup or migrate data

## 💡 Usage Examples & Demo Scenarios

### 🔍 Scenario 1: Personal Financial Health Check

**Objective**: Get a complete overview of Alice's financial situation

**Steps**:

1. **View Account Overview**: Access `accounts://all` resource
2. **Check Recent Activity**: Use `transactions://user/1` for Alice's transactions
3. **Analyze Spending**: Run `analyze-spending` tool with `userId: 1, period: "month"`
4. **Budget Review**: Execute `check-budget-status` tool with `userId: 1`
5. **Get AI Insights**: Use `generate-financial-insights` with focus on "budgeting"

**Expected Results**: Complete financial overview with AI-powered recommendations

### 💳 Scenario 2: Add New Transaction

**Objective**: Record a new purchase and see real-time budget impact

**Steps**:

1. **Add Transaction**: Use `create-transaction` tool:
   ```json
   {
     "accountId": 1,
     "amount": -75.5,
     "description": "Gas Station Purchase",
     "category": "transportation",
     "merchant": "Shell Gas Station",
     "tags": ["fuel", "commute"]
   }
   ```
2. **Verify Update**: Check `accounts://1/details` for updated balance
3. **Review Budget Impact**: Run `check-budget-status` to see category changes

### 🤖 Scenario 3: AI-Powered Financial Advice

**Objective**: Get personalized financial recommendations

**Steps**:

1. **Use Financial Advice Prompt**:
   - Prompt: `financial-advice`
   - Parameters: `userId: 1, focus: "saving"`
2. **Budget Optimization**:
   - Prompt: `budget-optimization`
   - Parameters: `userId: 1`
3. **Implement Suggestions**: Create transactions or account changes based on advice

### 📊 Scenario 4: Business Expense Tracking

**Objective**: Monitor business expenses for tax and budgeting purposes

**Steps**:

1. **Review Business Account**: Access Bob's account (`userId: 2`)
2. **Add Business Expense**: Record office supplies, travel, or equipment purchases
3. **Category Analysis**: Use spending analysis for business expense categories
4. **Budget Compliance**: Check if staying within business budget limits

### 🎯 Scenario 5: Multi-Period Analysis

**Objective**: Compare spending across different time periods

**Steps**:

1. **Weekly Analysis**: `analyze-spending` with `period: "week"`
2. **Monthly Comparison**: `analyze-spending` with `period: "month"`
3. **Quarterly Overview**: `analyze-spending` with `period: "quarter"`
4. **Trend Identification**: Compare results to identify spending patterns

## 🔍 Advanced Features & Technical Details

### 🧠 AI-Powered Intelligence

- **Contextual Analysis**: AI understands your complete financial picture
- **Personalized Advice**: Recommendations based on actual spending patterns
- **Budget Optimization**: Smart suggestions for improving financial health
- **Trend Recognition**: Identifies spending patterns and anomalies

### 📊 Real-time Budget Monitoring

- **Live Tracking**: Instant updates as transactions are added
- **Category Breakdown**: Detailed spending vs. budget by category
- **Alert System**: Warnings when approaching or exceeding budget limits
- **Percentage Tracking**: Visual representation of budget utilization

### 🏗️ Robust Architecture

- **MCP Protocol**: Full implementation of Model Context Protocol standards
- **Resource Templates**: Dynamic URI patterns for flexible data access
- **Error Handling**: Comprehensive error management and user feedback
- **Type Safety**: Full TypeScript implementation with proper type definitions

### 🔄 Data Management

- **Atomic Operations**: Safe transaction processing with rollback capabilities
- **Referential Integrity**: Automatic validation of relationships between data
- **Real-time Sync**: Live balance updates across all account operations
- **Audit Trail**: Complete transaction history with timestamps and metadata

### 🎛️ Extensibility Features

- **Plugin Architecture**: Easy to add new tools and resources
- **Custom Categories**: Support for user-defined transaction categories
- **Flexible Tagging**: Multiple tags per transaction for enhanced organization
- **Multi-Currency**: Built-in support for different currencies (extensible)

## 🔧 Development & Customization

### 📁 Project Structure

```
mcp-server-and-client/
├── src/
│   ├── server.ts           # Main MCP server implementation
│   ├── client.ts           # Interactive client application
│   └── data/               # JSON data storage
│       ├── users.json      # User profiles
│       ├── accounts.json   # Financial accounts
│       ├── transactions.json # Transaction history
│       └── budgets.json    # Budget configurations
├── build/                  # Compiled JavaScript output
├── demo.js                # Automated demo script
├── package.json           # Dependencies and scripts
└── README.md              # This documentation
```

### 🛠️ Adding New Features

#### Adding a New Tool

```typescript
server.tool(
  "your-tool-name",
  "Description of what your tool does",
  {
    // Zod schema for parameters
    param1: z.string().describe("Parameter description"),
    param2: z.number().optional().describe("Optional parameter"),
  },
  {
    title: "Tool Display Name",
    readOnlyHint: false, // Set to true if tool doesn't modify data
    destructiveHint: false, // Set to true if tool deletes data
    idempotentHint: true, // Set to true if safe to run multiple times
    openWorldHint: true, // Set to true if tool can work with various inputs
  },
  async (params: any) => {
    // Your tool implementation here
    return {
      content: [{ type: "text", text: "Tool result" }],
    };
  }
);
```

#### Adding a New Resource

```typescript
server.resource(
  "resource-name",
  "resource://uri/pattern",
  {
    description: "What this resource provides",
    title: "Resource Display Name",
    mimeType: "application/json",
  },
  async (uri: any) => {
    // Load and return your data
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(yourData),
          mimeType: "application/json",
        },
      ],
    };
  }
);
```

### 🧪 Testing & Validation

- **Built-in Demo**: Use `npm run demo` for automated testing
- **MCP Inspector**: Visual testing interface for all features
- **Error Scenarios**: Test error handling with invalid inputs
- **Data Validation**: All inputs validated with Zod schemas

## � Future Enhancements & Roadmap

### 📈 Phase 2: Advanced Analytics

- **Investment Portfolio Tracking**: Monitor stocks, bonds, and crypto assets
- **Predictive Modeling**: Forecast future spending and savings
- **Goal-Based Planning**: Set and track financial goals with milestones
- **Comparative Analysis**: Benchmark against industry standards

### 🔗 Phase 3: External Integrations

- **Bank API Connections**: Direct integration with financial institutions
- **Credit Score Monitoring**: Track credit health and improvements
- **Bill Payment Automation**: Automated bill detection and payment scheduling
- **Tax Optimization**: Smart categorization for tax reporting

### 🤖 Phase 4: Enhanced AI Features

- **Spending Prediction**: Machine learning for expense forecasting
- **Automated Insights**: Daily/weekly financial health reports
- **Smart Alerts**: Proactive notifications for unusual spending
- **Voice Interface**: Natural language commands for financial management

### 🌐 Phase 5: Advanced Capabilities

- **Multi-User Households**: Family financial management
- **Business Features**: Advanced business expense tracking and reporting
- **Mobile Integration**: Mobile app with real-time sync
- **Advanced Reporting**: Custom dashboards and detailed analytics

## 📚 Learning Resources

### 🎓 Understanding MCP

- **Model Context Protocol**: [Official MCP Documentation](https://modelcontextprotocol.io/)
- **Server Development**: Learn how to build MCP servers
- **Client Integration**: Understand MCP client implementation patterns

### 💡 Project Insights

- **Architecture Patterns**: See how complex data relationships are managed
- **AI Integration**: Learn how to integrate LLMs with structured data
- **Real-world Application**: Understand practical MCP server design

### 🛠️ Technical Skills

- **TypeScript**: Advanced TypeScript patterns and type safety
- **JSON Schema**: Data validation and API design
- **Financial Modeling**: Basic financial data structure design

## 🤝 Contributing & Support

### 🐛 Found a Bug?

1. Check existing issues in the repository
2. Create detailed bug report with steps to reproduce
3. Include system information and error logs

### 💡 Feature Requests

1. Describe the feature and its use case
2. Explain how it fits with existing functionality
3. Consider implementation complexity and user benefit

### 🔧 Development Contributions

1. Fork the repository
2. Create feature branch with descriptive name
3. Implement changes with proper testing
4. Submit pull request with detailed description

## 📄 License & Credits

### 📜 License

This project is open source and available under the ISC License.

### 🙏 Acknowledgments

- **Model Context Protocol**: For the amazing MCP framework
- **TypeScript Community**: For excellent tooling and type safety
- **Financial Data Standards**: For inspiration on data modeling
- **Open Source Community**: For continuous innovation and collaboration

---

## 🎉 Ready to Start?

This Smart Personal Finance Assistant demonstrates the incredible potential of MCP servers for creating intelligent, data-driven applications. Whether you're learning MCP development, building financial tools, or exploring AI integration patterns, this project provides a comprehensive foundation.

**Get started now:**

```bash
npm install
npm run server:inspect
```

**Visit the web interface at:** `http://127.0.0.1:6274`

**Happy financial managing! 💰🚀**
