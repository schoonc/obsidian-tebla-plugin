import type { StoreRawState } from "../src/domain/schemaTypes"

export const getTestState = (): StoreRawState => {
    return {
      version: 1,
      mainContentItemsOrder: ['0f5e0d1c-7ce9-4783-baa3-c9534f279a03', '364d6de1-1b35-4472-8263-a5dbf5a7a383'],
      items: [
        {
          itemId: '0f5e0d1c-7ce9-4783-baa3-c9534f279a03',
          question: 'some question 1',
          answer: 'some answer 1',
          "card": {
            "due": new Date("2025-08-23T13:24:51.733Z"),
            "stability": 0,
            "difficulty": 0,
            "elapsed_days": 0,
            "scheduled_days": 0,
            "reps": 0,
            "lapses": 0,
            "learning_steps": 0,
            "state": 0
          }
        },
        {
          itemId: '364d6de1-1b35-4472-8263-a5dbf5a7a383',
          question: 'some question 2',
          answer: 'some answer 2',
          "card": {
            "due": new Date("2025-08-23T13:24:51.733Z"),
            "stability": 0,
            "difficulty": 0,
            "elapsed_days": 0,
            "scheduled_days": 0,
            "reps": 0,
            "lapses": 0,
            "learning_steps": 0,
            "state": 0
          }
        }
      ],
      "fsrsParams": {
        "request_retention": 0.9,
        "maximum_interval": 36500,
        "w": [
          0.212,
          1.2931,
          2.3065,
          8.2956,
          6.4133,
          0.8334,
          3.0194,
          0.001,
          1.8722,
          0.1666,
          0.796,
          1.4835,
          0.0614,
          0.2629,
          1.6483,
          0.6014,
          1.8729,
          0.5425,
          0.0912,
          0.0658,
          0.1542
        ],
        "enable_fuzz": false,
        "enable_short_term": true,
        "learning_steps": [
          "1m",
          "10m"
        ],
        "relearning_steps": [
          "10m"
        ]
      }
    }
}

export const getTestData = (): string => {
  return `---
isTebla: true
---

## Question%%0f5e0d1c-7ce9-4783-baa3-c9534f279a03%%
some question 1

## Answer
some answer 1

---

## Question%%364d6de1-1b35-4472-8263-a5dbf5a7a383%%
some question 2

## Answer
some answer 2

\`\`\`json
{
  "version": 1,
  "fsrsParams": {
    "request_retention": 0.9,
    "maximum_interval": 36500,
    "w": [
      0.212,
      1.2931,
      2.3065,
      8.2956,
      6.4133,
      0.8334,
      3.0194,
      0.001,
      1.8722,
      0.1666,
      0.796,
      1.4835,
      0.0614,
      0.2629,
      1.6483,
      0.6014,
      1.8729,
      0.5425,
      0.0912,
      0.0658,
      0.1542
    ],
    "enable_fuzz": false,
    "enable_short_term": true,
    "learning_steps": [
      "1m",
      "10m"
    ],
    "relearning_steps": [
      "10m"
    ]
  },
  "items": [
    {
      "itemId": "0f5e0d1c-7ce9-4783-baa3-c9534f279a03",
      "card": {
        "due": "2025-08-23T13:24:51.733Z",
        "stability": 0,
        "difficulty": 0,
        "elapsed_days": 0,
        "scheduled_days": 0,
        "reps": 0,
        "lapses": 0,
        "learning_steps": 0,
        "state": 0
      }
    },
    {
      "itemId": "364d6de1-1b35-4472-8263-a5dbf5a7a383",
      "card": {
        "due": "2025-08-23T13:24:51.733Z",
        "stability": 0,
        "difficulty": 0,
        "elapsed_days": 0,
        "scheduled_days": 0,
        "reps": 0,
        "lapses": 0,
        "learning_steps": 0,
        "state": 0
      }
    }
  ]
}\`\`\``
}