import ast
import json

output = open("metadata.json", "w+")
result = ""

invalid_json = []
with open("metadata_clean.json", "r") as f:
    lines = f.readlines()
    ctr = 0
    for i in range(len(lines)):
        print(ctr)
        try:
            result += json.dumps(ast.literal_eval(lines[i])) + ",\n"
        except Exception as exp:
            invalid_json.append(lines[i][10:20])
        ctr += 1
print("Invalid JSON: {}".format(invalid_json))
output.write("[{}]".format(result.strip(",\n")))
output.close()

