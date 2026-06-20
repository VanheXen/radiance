#!/usr/bin/env python3
"""Run the whole test suite: regenerate fixtures, validate the model + branch
coverage, then the interactive UI paths. Exit non-zero if anything fails."""
import subprocess, sys

def run(label, cmd):
    print(f"\n=== {label} ===")
    return subprocess.run(cmd).returncode

rc  = run("generate fixtures", [sys.executable, "gen_testdata.py"])
rc |= run("model + branch coverage", ["node", "test_model.js"])
rc |= run("interactive UI", ["node", "test_ui.js"])

print("\n" + ("ALL GREEN" if rc == 0 else "FAILURES, see above"))
sys.exit(1 if rc else 0)
