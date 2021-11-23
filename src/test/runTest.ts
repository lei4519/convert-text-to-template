import * as path from "path"

// 1 是的 2 哈哈 3 六六六
export const VAR_NAME = [
  { label: "是的 ", value: 1 },
  { label: "哈哈 ", value: 2 },
  { label: "六六六", value: 3 },
]

import { runTests } from "@vscode/test-electron"

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../")

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index")

    // Download VS Code, unzip it and run the integration test
    await runTests({ extensionDevelopmentPath, extensionTestsPath })
  } catch (err) {
    console.error("Failed to run tests")
    process.exit(1)
  }
}

main()
