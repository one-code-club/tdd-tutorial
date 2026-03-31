import type { GuideSection } from './ja-guide'

export const enGuide = {
  pageTitle: 'User Guide',
  intro:
    'This page is a simple guide to using the TDD Tutorial app. If you get stuck, you can always come back here to check.',
  sections: [
    {
      id: 'purpose',
      title: 'App Overview',
      points: [
        'This app helps you learn **TDD (Test-Driven Development)** using blocks.',
        'In TDD, you write a **test first** before writing the code itself. Think of a test as an "answer key" for how your code should behave.',
        'The core TDD cycle is: **Write a test -> Write code -> Run tests and verify**. Repeat this loop.',
        'By combining blocks, you can experience this flow and improve your skills step by step.',
      ],
    },
    {
      id: 'login',
      title: '1. Logging In',
      points: [
        'On the start screen, enter your **Nickname** and click **Start**.',
        'Please use the same nickname each time.',
        'There are no complicated settings. You can start learning right away.',
      ],
    },
    {
      id: 'create-empty-function',
      title: '2. Create an Empty Function',
      points: [
        'Select **Function** from the left panel and give it a descriptive name.',
        'For example, if it calculates an admission fee based on age, name it **"Admission Fee Check"**.',
        'At this stage, leave the inside of the function empty.',
      ],
    },
    {
      id: 'insert-sample-function',
      title: '3. Insert a Sample Function',
      points: [
        'Click the **Sample Code** button in the header to quickly insert an example function.',
        'Use the samples first to learn how to connect the blocks.',
        'Once you run a sample, try rewriting it little by little to make it your own.',
      ],
    },
    {
      id: 'create-test-case',
      title: '4. Create a Test Case',
      points: [
        'Place a **Test** block and give it a clear test name.',
        'Connect the blocks in this order: **Setup -> Execute -> Assert**.',
        'In **Setup**, set the input values (variables) for the function.',
        'In **Execute**, call the function you prepared in step 2.',
        'In **Assert**, verify if the function result matches your expectation (check if **Expected** equals **Actual**).',
      ],
    },
    {
      id: 'run-test',
      title: '5. Run Tests',
      points: [
        'Click the **Run** button on the right to execute all tests at once.',
        'Before you finish the function, the tests will fail. That is perfectly normal.',
        'Failed tests will turn red and show an error message.',
        'Passed tests will turn green.',
        'You can also see the test results in the console.',
      ],
    },
    {
      id: 'complete-function',
      title: '6. Complete the Function',
      points: [
        'Use various blocks to fill in the function body.',
        'For example, use an **if** block to calculate different fees depending on age.',
        'Combine logic, math, and other blocks to make your function work correctly.',
      ],
    },
    {
      id: 'final-test',
      title: '7. Final Test Run',
      points: [
        'Run the tests again. Fix any bugs until all tests pass.',
        'Keep debugging until every test block turns green.',
      ],
    },
    {
      id: 'export-import',
      title: 'Export / Import Code',
      points: [
        'Use **Download** to save your current progress as a file.',
        'Use **Import** to load a previously saved file.',
        'This is handy if you want to continue your work on another day.',
      ],
    },
    {
      id: 'sample-functions',
      title: 'Insert Sample Functions',
      points: [
        'The app includes samples like **"Admission Fee Check"** and **"Vending Machine"**.',
        'Select one from the **Sample Code** dropdown in the header to add it to your workspace.',
        'Each sample is available in **both Japanese and English**, so pick the one you prefer.',
        'Try selecting a function from the dropdown now (both JA and EN versions are available).',
      ],
    },
  ] as GuideSection[],
}
