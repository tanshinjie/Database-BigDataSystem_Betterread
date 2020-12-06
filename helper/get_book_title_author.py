import requests
from bs4 import BeautifulSoup
import json
from itertools import chain
from iteration_utilities import duplicates, unique_everseen
import ast

def scrape_title_author(asins,start,stop):
    not_found = []
    with open("bookdetails_{}_{}.csv".format(start,stop), "w") as f:
        for i in range(start, stop):
            try:
                print(i)
                URL = "https://www.goodreads.com/search?q={}".format(asins[i])
                page = requests.get(URL)
                soup = BeautifulSoup(page.content, "html.parser")
                result = soup.find("a", {"class": "bookTitle"})
                if result != None:
                    entry = asins[i] + ", "
                    for j in result.children:
                        if j.string != "\n":
                            entry += j.string + ", "
                    result = soup.find("a", {"class": "authorName"})
                    for j in result.children:
                        entry += j.string + "\n"
                    f.write(entry)
                else:
                    not_found.append(asins[i])
            except:
                print("error", i)
                print("asin not found", not_found)
    with open('asin_not_found','a') as f:
        f.write(str(not_found))

def extract_asin_to_file():
    metadata = None
    asin = []
    with open("meta_Kindle_Store.json", "r") as f:
        meta_d = f.readlines()
        for i in meta_d:
            asin.append(i[10:20])
    with open("extracted_asin.txt", "w+") as f:
        f.write(",".join(asin))

def load_extracted_asins(filename):
    with open(filename, "r") as f:
        asin = f.read()
        return asin.split(",")

def change_delimeter(filename):
    with open(filename, "r") as f:
        lines = f.readlines()
        with open("___{}___.csv".format(filename.split('.')[0]), "w+") as w:
            for line in lines:
                last_delimeter_index = line.rindex(", ")
                result = line.replace(", ", "_ ", 1)
                front = result[:last_delimeter_index]
                back = result[last_delimeter_index + 2 :]
                join = front + "_ " + back
                w.write(join)

def csv_to_json(filename):
    f = open(filename,'r')
    lines = f.readlines()
    output = []
    with open('{}.json'.format(filename.split('.')[0]),'w') as fout:
        for line in lines:
            try:
                data = {}
                tmp = line.split('_ ')
                data['asin'] = tmp[0]
                data['title'] = tmp[1]
                data['author'] = tmp[2].rstrip('\n')
                output.append(data)
            except:
                print(line)

        fout.write(json.dumps(output))

def clean_category():
    category_set = {}
    ctr = 0
    with open("meta_Kindle_Store.json", "r+") as f:
        lines = f.readlines()
        for l in lines:
            print(ctr)
            start_index = l.index("[[")
            end_index = l.index("]]") + 2
            try:
                if l[start_index:end_index] != "":
                    c = ast.literal_eval(l[start_index:end_index])
                    c = list(chain.from_iterable(c))
                    joined_c = list(category_set) + c
                    category_set = set(joined_c)
                    ctr += 1
            except:
                print("error")

    with open("category.txt", "w+") as f:
        category_list = sorted(list(category_set))
        category_str = "\n".join(category_list)
        f.write(category_str)

def flatten_category():
    result = ""
    ctr = 0
    with open("meta_Kindle_Store.json", "r") as f:
        lines = f.readlines()
        for l in lines:
            res = ""
            print(ctr)
            try:
                c_start_index = l.index("[[")
                c_end_index = l.index("]]") + 2
                c = ast.literal_eval(l[c_start_index:c_end_index])
                c = list(dict.fromkeys(chain.from_iterable(c)))
                res = (
                    l[:c_start_index]
                    + "["
                    + ", ".join('"{0}"'.format(w) for w in c)
                    + "]"
                    + l[c_end_index:]
                )
                result += res
                ctr += 1
            except:
                print("error")
    with open("metadata_clean.txt", "w+") as f:
        f.write(result)

def random_select_category(start,step):
    with open("category.txt", "r") as f:
        lines = f.read()
        c = lines.split("\n")
        print(len(c))
        c_list = []
        for i in range(start, len(c), step):
            print(i)
            c_list.append(c[i])
        print(len(c_list))
        print("[" + ", ".join('"{0}"'.format(w) for w in c_list) + "]")

def get_asins_not_scraped():
    asins = load_extracted_asins()
    f = open('___bookdetails_combined___.csv','r')
    lines = f.readlines()
    asins_scraped = []
    for line in lines:
        asins_scraped.append(line.split('_')[0])
    f.close()
    asins_not_scraped = list(set(asins)-set(asins_scraped))
    print(len(asins_not_scraped))
    with open('asins_not_scraped.txt','w') as f:
        f.write(str(asins_not_scraped))
    return asins_not_scraped

def check_duplicate():
    with open('___bookdetails_combined___.csv','r') as f:
        lines = f.readlines()
        asins = []
        for line in lines:
            asin = line.split('_')[0]
            asins.append(asin)
        asins_set = set(asins)
        print(list(set(asins))[0])
        print(list(set(asins))[len(set(asins))-1])
        print('has duplicate?',len(asins)!=len(asins_set))



if __name__ == "__main__":
    # clean_category()
    # flatten_category()
    # random_select_category(18,50)

    # print('Extracting meta_kindle_store.json...')
    # extract_asin_to_file()
    # print('Done\n')

    # print('Loading extracted asin to list...')
    # asins_dedup = load_extracted_asins('asins_not_found_dedup.txt')
    # print(len(asins_dedup))

    asin_not_found = load_extracted_asins('asin_not_found')
    asin_not_found_dedup = load_extracted_asins('asins_not_found_dedup.txt')
    # print(set(asin_not_found) - (set(asin_not_found_dedup)))
    # print(len(set(asin_not_found)))

    # all_asins = load_extracted_asins('extracted_asins.txt')
    # print(len(all_asins))

   
    # asins_scraped = load_extracted_asins('asins_scraped.txt')
    # print(len(asins_scraped))
    # print(len(set(asins_scraped)))
    # print(len(all_asins)-len(set(asins_scraped)))
    # # print(duplicates)
    # dupped = unique_everseen(duplicates(asins_scraped))
    # new_asins_scraped = []
    # with open('___bookdetails_combined___.csv','r') as f:
    #     lines = f.readlines()
    #     for line in lines:
    #         new_asins_scraped.append(line.split('_')[0])
    # # with open('asins_scraped.txt','w') as f:
    # #     f.write(','.join(new_asins_scraped))
    # new_dupped = unique_everseen(duplicates(new_asins_scraped))
    # print(len(list(dupped)))
    # print(len(list(new_dupped)))
    # # dupped = load_extracted_asins('dupped.txt')
    # # print(len(dupped))
    # # print(type((list(dupped))))
    # # print(dupped.index('B007SGK04A')-dupped.index('B009CHBT84'))
    # # print(dupped_list[0])
    # # print(dupped_list[len(dupped_list)-1])

    # with open('___bookdetails_combined___.csv','r') as f:
    #     lines = f.readlines()
    #     for line in lines:
    #         asins_scraped.append(line.split('_')[0])

    # dupped = set([x for x in asins_scraped if asins_scraped.count(x) > 1])
    # with open('dupped.txt','w') as f:
    #     f.write(','.join(dupped_list))

    
    # x = set(asins_not_found).intersection(set(asins_scraped))
    # print(x)
    # a = list(set(asins_not_found)-set(asins_scraped))
    # with open('asins_not_found_dedupp.txt','w') as f:
    #     f.write(','.join(a))

    # asins_not_found = load_extracted_asins('asin_not_found')
    # print(len(asins_not_found))
    # print(len(set(asins_not_found)))

    # with open('unknown_asins.txt','w') as f:
    #     f.write(','.join(asins_unknown))

    # # with open('ains_not_found_dedup.txt','w') as f:
    # #     f.write(','.join(list(set(asins))))
    # # # print(list(set(asins)))
    # print('Done\n')

    # asins_not_scraped =  load_extracted_asins('asins_not_scraped.txt')
    # print(len(asins_not_scraped))
    # print('Scraping title and author from asin through web...')
    # scrape_title_author(asins_not_scraped, 0, 2000)
    # scrape_title_author(asins_not_scraped, 2000, 4000)
    # scrape_title_author(asins_not_scraped, 4000, 6000)
    # scrape_title_author(asins_not_scraped, 6000, 8000)
    # scrape_title_author(asins_not_scraped, 8000, len(asins_not_scraped))
    # print('Done\n')

    # print('Changing delimeter from ", " to "_ "')
    # change_delimeter('bookdetails_0_2000.csv')
    # change_delimeter('bookdetails_2000_4000.csv')
    # change_delimeter('bookdetails_4000_6000.csv')
    # change_delimeter('bookdetails_6000_8000.csv')
    # print('Done\n')

    print('Converting csv to json')
    csv_to_json('___bookdetails_combined___.csv')
    print('Done\n')

    # print('Check for duplicates')
    # check_duplicate()
    # print("Done\n")
