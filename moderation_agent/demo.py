"""Demo CLI for testing the Moderation Agent directly.

Usage:
    python -m moderation_agent.demo "Your test comment or text here"
    python -m moderation_agent.demo --interactive
    python -m moderation_agent.demo
"""
import json
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[1] / ".env", override=False)

from moderation_agent.agent import ModerationAgent


def run_check(agent: ModerationAgent, text: str):
    result = agent.check_comment(text)
    print("\n" + "=" * 60)
    print(f"Input:       {text}")
    print(f"Status:      {result.status.upper()}")
    print(f"Categories:  {', '.join(result.categories) or 'none'}")
    print(f"Confidence:  {result.confidence:.2f}")
    print(f"Source:      {result.source}")
    print(f"Reason:      {result.reason}")
    if result.flagged_terms:
        print(f"Terms:       {result.flagged_terms}")
    print("=" * 60)


def main():
    agent = ModerationAgent()
    args = sys.argv[1:]

    if "--interactive" in args:
        print("Leaf Moderation Agent Interactive Shell (type 'exit' or 'quit' to stop):")
        while True:
            try:
                line = input("\nEnter text > ").strip()
                if not line or line.lower() in {"exit", "quit"}:
                    break
                run_check(agent, line)
            except (KeyboardInterrupt, EOFError):
                break
        return

    if args:
        run_check(agent, " ".join(args))
        return

    # Run default test suite demo samples
    samples = [
        "What a beautiful chapter! The worldbuilding is astonishing.",
        "kill yourself you piece of shit author",
        "Earn $5,000 a day with our free crypto giveaway click here!",
        "This author is an idiot and your story is trash.",
        "I feel depressed reading this, feel like giving up on everything.",
    ]
    print("Running Moderation Agent demonstration on sample inputs:")
    for sample in samples:
        run_check(agent, sample)


if __name__ == "__main__":
    main()
