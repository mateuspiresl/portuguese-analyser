const classification = require('./classification');


const phraseDelimitierRegex = /^(\.|!|\?|,)$/;
const phraseEndDelimitierRegex = /^(\.|!|\?)$/;

class EndOfFileError extends Error {
  constructor () { super('End of file'); }
}

class SyntacticAnalyser
{
  constructor () { }

  has (i) {
    return i < this.tokens.length;
  }

  get (i) {
    // console.log('GET', i, JSON.stringify(this.tokens[i]));

    if (i < this.tokens.length) return this.tokens[i];
    else throw new EndOfFileError();
  }

  getToken (i) {
    return this.get(i).token;
  }

  getClass (i) {
    return this.get(i).class;
  }

  isClass(i, clas) {
    return this.getClass(i).reduce((result, value) => {
      return value.equals(clas);
    }, false);
  }

  isWord (i) {
    return !this.isClass(i, classification.Punctuation);
  }

  isPhraseDelimitier (i) {
    return this.isClass(i, classification.Punctuation)
      && phraseDelimitierRegex.test(this.getToken(i));
  }

  isPhraseEndDelimitier (i) {
    return this.isClass(i, classification.Punctuation)
      && phraseEndDelimitierRegex.test(this.getToken(i));
  }

  analyse (tokens)
  {
    this.tokens = tokens;
    // console.log('TOKENS', JSON.stringify(tokens));

    let i = this.matchMultiplePhrase(0);
    
    if (!this.isPhraseEndDelimitier(i))
      throw new Error('Missing end punctuation');

    if (this.has(i + 1))
      throw new Error('Remaining content');
  }

  matchMultiplePhrase (i)
  {
    const state = i;
    i = this.matchPhrase(i);

    if (state === i)
      throw new Error('Didn\'t find a phrase');

    console.log('Found phrase: %s', this.tokens.slice(state, i).map(token => token.token));

    if (this.isPhraseDelimitier(i) && this.has(i + 1) && this.isWord(i + 1))
      return this.matchMultiplePhrase(i + 1);
    
    return i;
  }

  matchPhrase (i)
  {
    const state = i;
    i = this.matchSubject(i);
    if (i === state) return state;

    console.log('Found subject (%d): %s', i, this.tokens.slice(state, i).map(token => token.token));

    while (!this.isPhraseDelimitier(i)) i++;
    return i;
  }

  // ter = sub [pre ter]
  // suj = [art] [adj] ter
  // prd = ver [art|pre ter] [adv]
  // suj prd

  // os felizes amigos de João brincam de bola de gude semanalmente
  // suj = os felizes amigos de João
  // ver = brincam
  // com = de bola de gude semanalmente
  // com, ver suj = de bola de gude semanalmente, brincam os felizes amigos de João
  // suj, com ver = os felizes amigos de João, de bola de gude semanalmente brincam

  matchSubject (i)
  {
    const state = i;

    if (this.isClass(i, classification.Article)) i++;
    if (this.isClass(i, classification.Adjetive)) i++;

    const result = this.matchTerm(i);
    return result === i ? state : result;
  }

  matchTerm (i)
  {
    if (!this.isClass(i, classification.Noun)) return i;
    if (this.isClass(++i, classification.Preposition))
    {
      const state = i + 1;
      const result = this.matchTerm(state);
      return result === state ? i : result;
    }

    return i;
  }

  matchPredicate (i)
  {

  }

  matchComplement (i)
  {

  }
}


module.exports = function (tokens) {
  new SyntacticAnalyser().analyse(tokens);
}