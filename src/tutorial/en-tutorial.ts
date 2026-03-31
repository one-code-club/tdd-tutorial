import type { TutorialData } from './types'

export const enTutorial: TutorialData = {
  pageTitle: 'TDD Tutorial',
  subtitle: 'Test Driven Development',
  intro:
    'In this tutorial, you will learn how to write code using **TDD (Test Driven Development)**. TDD means you write **tests first**, then write code to make the tests pass. Follow the steps below one by one!',
  feeTable: {
    title: 'CSE Park Admission Fees',
    rows: [
      { label: '12 and younger', age: '0 - 12', fee: '500 YEN' },
      { label: '13 to 17', age: '13 - 17', fee: '800 YEN' },
      { label: '18 and older', age: '18+', fee: '1000 YEN' },
    ],
  },
  steps: [
    {
      id: 'create-function',
      stepNumber: 1,
      title: 'Create an Empty Function',
      description:
        'First, create a function called **getFee**. This function will calculate the admission fee based on age. But don\'t write the code inside yet -- just create an empty function!',
      points: [
        'From the left panel, drag a **Function** block to the workspace.',
        'Name the function **getFee**.',
        'Leave the inside of the function **empty** for now.',
      ],
      tip: 'In TDD, we create the function first but leave it empty. We will write the tests before writing the actual code!',
      images: ['/1.png'],
    },
    {
      id: 'write-tests',
      stepNumber: 2,
      title: 'Write Tests FIRST!',
      description:
        'Now, write tests that describe what the function should do. Each test checks: "If I give this age, what fee should I get back?"',
      points: [
        'Drag a **Test** block to the workspace and name it (e.g., **test12**).',
        'In **Setup**: Set the variable **age** to **12**.',
        'In **Execute**: Call the **getFee** function.',
        'In **Assert**: Check that the variable **fee** equals **500**.',
        'Create more tests! For example: age **15** should give **800**, and age **18** should give **1000**.',
      ],
      tip: 'You can copy a test block by right-clicking it and selecting **Duplicate**. Then just change the test name and values!',
      images: ['/2.png', '/3.png'],
    },
    {
      id: 'run-fail',
      stepNumber: 3,
      title: 'Run the Tests -- They Will FAIL!',
      description:
        'Click the **Run** button to execute your tests. All tests will fail because the function is still empty. But that\'s totally fine!',
      points: [
        'Click the **Run** button on the right side.',
        'All test blocks will turn **red** -- this means they failed.',
        'You will see error messages like "**fee is not defined**".',
        'This is **expected** in TDD! Failing tests tell us what we need to build.',
      ],
      expectedResult: 'fail',
      images: ['/RED.png'],
    },
    {
      id: 'complete-function',
      stepNumber: 4,
      title: 'Complete the Function',
      description:
        'Now it\'s time to fill in the function! You can use the **Sample Code** button in the header to quickly insert a working example.',
      points: [
        'Click the **Sample Code** button in the header.',
        'Select **Admission Fee Function** from the dropdown.',
        'A complete function with if/else blocks will appear.',
        'Look at the function: it checks the age and sets the fee accordingly.',
      ],
      tip: 'The sample function uses **if/else if/else** blocks to check the age range and set the correct fee.',
      images: ['/4.png'],
    },
    {
      id: 'run-partial',
      stepNumber: 5,
      title: 'Run Tests Again -- Some May Fail!',
      description:
        'Run the tests again. Some tests might pass, but others might still fail. This means there is a **bug** in the function!',
      points: [
        'Click the **Run** button again.',
        'Some tests might turn **green** (pass) and some might stay **red** (fail).',
        'Look carefully at which tests fail -- this gives you a clue about what is wrong.',
        'For example, if **test12** fails, the function might not handle age 12 correctly.',
      ],
      expectedResult: 'partial',
      images: ['/RED2.png'],
    },
    {
      id: 'fix-bugs',
      stepNumber: 6,
      title: 'Fix the Bugs!',
      description:
        'Look at the function carefully. The sample code has a bug on purpose! Can you find what is wrong?',
      points: [
        'The bug is in the **comparison operators** (the symbols that compare numbers).',
        'The first condition uses **< 12** (less than 12), but it should be **<= 12** (less than or equal to 12). Otherwise, age 12 is not included!',
        'Similarly, **< 17** should be **<= 17**, and **> 18** should be **>= 18**.',
        'Fix these by changing the comparison blocks to include the equal sign.',
      ],
      tip: 'The difference between **<** and **<=** is important! **< 12** means "less than 12" (does NOT include 12), while **<= 12** means "12 or less" (includes 12).',
    },
    {
      id: 'all-pass',
      stepNumber: 7,
      title: 'All Tests Pass!',
      description:
        'Run the tests one more time. If you fixed the bugs correctly, all tests should now pass!',
      points: [
        'Click the **Run** button.',
        'All test blocks should turn **green**!',
        'Congratulations! You just completed the **TDD cycle**: Write tests -> Write code -> Fix bugs -> All tests pass!',
      ],
      expectedResult: 'pass',
      images: ['/GREEN.png'],
    },
  ],
  discussion: {
    title: 'Think About It!',
    questions: [
      {
        question: 'What happens if you set "age" to "Hello"?',
        hint: '"Hello" is text, not a number. The function expects a number, so comparing text with numbers might give unexpected results. This is why **input validation** is important!',
      },
      {
        question: 'What happens if you set "age" to -100?',
        hint: 'A negative age does not make sense in real life. The function would set fee to 0 because -100 is not >= 0. We could add a check for negative numbers!',
      },
      {
        question: 'What does it mean when the fee is "0"?',
        hint: 'A fee of 0 means the input did not match any of the conditions (like a negative age or text). It acts as a "default" value, but is it the right behavior? Maybe we should show an error message instead!',
      },
    ],
  },
  backToWorkspace: 'Go to Workspace and Try It!',
}
