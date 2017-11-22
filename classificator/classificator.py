import nlpnet
nlpnet.set_data_dir('/media/mateus/Data/Main/Projects/ufpb/fact-check/classificator/nlpnet_data/pos-pt')
tagger = nlpnet.POSTagger()

while True:
  text = input()
  print(tagger.tag(text))