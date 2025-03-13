Our commit logs are in this link we moved directories due to git problems


https://github.com/mmingyeomm/DAOagent


# Lucy (Eliza.os-based Solana DAO Agent)

![Image](https://github.com/user-attachments/assets/85e88107-8c6a-40d2-a682-57a9c660f10e)
---

## Project Background
**Lucy** is an AI agent built on [Eliza.os](https://github.com/cybermancy/eliza.os) with the following core mission:

> *“Enable anyone to easily and securely create and deploy DAO smart contracts on the Solana network using only natural language commands.”*

Traditionally, building a DAO on **Solana** requires in-depth knowledge of **Rust** and **Anchor** (or the native Solana SDK), as well as setting up complex **governance parameters**. Even for seasoned blockchain developers, this can be tedious, and for non-developers or smaller communities, it poses a very high barrier to entry.

To address this, **Lucy** **automates the entire process** of creating a DAO:

1. **Natural Language Requests**: The user might say, “Create a token-based voting DAO,”  
2. **AI-Based Code Generation**: Lucy uses a large language model (LLM) and built-in governance templates to automatically write the Rust/Anchor program code.  
3. **Automated Testing & Deployment**: The generated code is verified on the Solana devnet/testnet, and if no issues arise, it is deployed to mainnet.  
4. **DAO Management**: Finally, users can store their DAO’s code on a web platform or ask Lucy for additional features (e.g., new modules, changes to voting mechanisms) to carry out **continuous upgrades** and **governance management**.

Through this process, **even those without extensive technical expertise** can easily create DAOs and adopt **Solana governance**, thereby fostering the **ecosystem**’s expansion through increased DAO activity.

---

## Proposal Overview

### Problems

1. **High Technical Barrier**  
   - *Learning Rust & Anchor*: Launching a Solana DAO requires knowledge of Rust programming and the Anchor framework, which can be a major hurdle for non-developers or smaller teams.  
   - *Fragmented Tools & Documentation*: CLI tools, guides, and security checklists are scattered, making it difficult for beginners to adopt on-chain governance.

2. **Time Consumption & Risk of Errors**  
   - *Manual Build & Deployment*: Entering commands like `cargo build` and `anchor build` incorrectly or misconfiguring the environment can break the entire process.  
   - *Limited Security & Testing Resources*: Small teams or organizations often lack the means to thoroughly audit or professionally test smart contracts.

3. **Complex DAO Upgrades & Management**  
   - *Closed Governance Structures*: Existing solutions might support only specific voting methods, or require significant rework (like redeployment) to add new features.  
   - *Challenges in Tracking Proposal Histories*: If code and voting records are scattered, community members will struggle to track changes, eroding trust.

---

### Proposed Solution

**Lucy** simplifies **every phase** of DAO creation and management through a **4-phase system**:

1. **Phase 1: Ideation**  
   - Lucy gathers the user’s requirements via **natural language**. For example, if the user says, “I want to build a voting DAO,” Lucy will ask follow-up questions to fully understand the concept.  
   - Until the concept is clear, Lucy remains in Phase 1, repeatedly **seeking clarifications** and refining the user’s request.

2. **Phase 2: Detailed Information Gathering**  
   - Lucy asks for specifics such as which **governance token** to use, **voting rules** (weighting, quorum), **module features** (e.g., multi-signature), etc.  
   - Once enough information is collected, the AI can prepare **custom Rust/Anchor code**.  
   - If more details are needed or the user requests additional features, Lucy stays in Phase 2 and continues to ask questions.

3. **Phase 3: Code Generation & Deployment**  
   - Based on the finalized requirements, Lucy provides the Rust smart contract code in a format that **starts with “rust” and ends with “end contract”**.  
   - During this step, **only** the code necessary for deployment is provided, with **no extra commentary**.  
   - After reviewing the code, if the user says “Proceed with deployment,” Lucy can **auto deploy** to the Solana devnet/testnet and then to mainnet.  
   - If at any point the user wants additional features, Lucy returns to Phase 2 to adjust the requirements.

4. **Phase 4: DAO Management**  
   - After a successful deployment, Lucy asks, “Would you like to register this DAO on the Lucy web for management? (Yes/No)”  
   - If the user says “Yes,” Lucy links the DAO code to a web dashboard to continuously support features like **proposal creation**, **voting**, and **token distribution**.  
   - If the user says “No” or gives an unclear response, Lucy repeats the check in Phase 4.

Through these steps, Lucy allows even blockchain beginners to build and manage a DAO. Should **coding errors** or **new requirements** arise, Lucy handles them in a step-by-step manner, ensuring a **solid** final product.

---

## Impact

1. **Increased DAO Accessibility**  
   - **Broader User Base**: From non-developers and community leaders to established companies, anyone can experiment with **on-chain governance** without in-depth development knowledge.  
   - **Time & Cost Savings**: By using an automated workflow and pre-validated templates, teams can quickly launch a stable DAO.

2. **Energizing the Solana Ecosystem**  
   - **More Transactions & Projects**: As more DAOs emerge, proposals, voting, and transactions rise, which naturally boosts Solana network activity.  
   - **Community-Driven Innovation**: The ease of experimentation allows for diverse governance models and synergy with existing Solana projects (DeFi, NFTs, etc.).

3. **Reliable Smart Contract Environment**  
   - **Standardized Security Patterns**: The Rust code Lucy provides includes secure governance and voting logic by default, reducing potential vulnerabilities.  
   - **Transparency**: DAO transparency and a web dashboard for code and voting records foster trust within the community, enabling fair governance and a more decentralized approach.

---

## How to run & Precautions

**Start Lucy**
```
cd Lucy
pnpm i && pnpm build
pnpm start --characters="path/to/your/character.json"
```

**Start client**
```
cd Lucy
pnpm start:client
```

**Start deploy server**
```
cd Lucy\ac\app
node server.js 
```

**Precautions**

In phase 3, you must enter "deploy" for the deployment to be completed.
In the case of the character.json file, it is not disclosed as it represents the entirety of Lucy.
If Lucy does not satisfy the conditions related to a phase, she can return to the previous phase or repeat the current phase.

---

## Team Info

- **Project Lead: Mingyeom Kim**  
  - *Git*: [https://github.com/mmingyeomm](https://github.com/mmingyeomm)  
  - *Twitter*: [https://x.com/kimant420](https://x.com/kimant420)  
  - *Telegram*: `@mmingyeomm`

- **Project Member: Hyuntae Kwon**  
  - *Git*: [https://github.com/Lyeoul](https://github.com/Lyeoul)  
  - *Twitter*: [https://x.com/Mual__Lyeoul](https://x.com/Mual__Lyeoul)  
  - *Telegram*: `@kkKuhn`

Both members have experience in **Solana smart contract** implementation and **AI-driven process design**, aiming to balance **technical expertise** with **user experience**. In particular, Lucy’s **4-phase structure** organizes the DAO creation workflow to meticulously reflect **step-by-step requirements** and ensure **stable deployments**. This approach will enable anyone in the Solana ecosystem who needs a DAO to easily and securely implement **decentralized governance**.

---

## Lucy always by your side.
![Image](https://github.com/user-attachments/assets/a835e803-9c13-4112-8827-fc975ce5d37f)
