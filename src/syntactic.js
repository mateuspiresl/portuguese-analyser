const classification = require('./classification');


const phraseDelimitierRegex = /^(\.|!|\?|,)$/;
const phraseEndDelimitierRegex = /^(\.|!|\?)$/;

class SyntacticError extends Error {
  constructor (message) { super(message); }
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
    else throw new SyntacticError('End of file');
  }

  getToken (i) {
    return this.get(i).token;
  }

  getClass (i) {
    return this.get(i).class;
  }

  isClass(i, ...classes)
  {
    let result;

    this.getClass(i).forEach(aClass => {
      classes.forEach(bClass => {
        return !(result = aClass.equals(bClass));
      });
    });

    return result;
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
    this.tokens.forEach(token => console.log('TOKEN', JSON.stringify(token)));

    let i = this.matchMultiplePhrase(0);
    
    if (!this.isPhraseEndDelimitier(i))
      throw new SyntacticError('Missing end punctuation');

    if (this.has(i + 1))
      throw new SyntacticError('Remaining content');
  }

  matchMultiplePhrase (i)
  {
    const state = i;
    i = this.matchPhrase(i);

    if (state === i)
      throw new SyntacticError('Didn\'t find a phrase');

    console.log('Found phrase (%d): %s', i, this.tokens.slice(state, i).map(token => token.token));

    if (this.isPhraseDelimitier(i) && this.has(i + 1) && this.isWord(i + 1))
      return this.matchMultiplePhrase(i + 1);
    
    return i;
  }

  matchPhrase (i)
  {
    const subjectState = i;
    i = this.matchSubject(i);
    if (i === subjectState) return subjectState;

    console.log('Found subject (%d): %s', i, this.tokens.slice(subjectState, i).map(token => token.token));

    const predicateState = i;
    i = this.matchPredicate(i);
    if (i === predicateState) return subjectState;

    console.log('Found predicate (%d): %s', i, this.tokens.slice(predicateState, i).map(token => token.token));

    return i;
  }

  // ter = sub [pre ter]
  // suj = [art] [adj] ter
  // com = [art|pre ter] [adv]
  // prd = ver com
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
    if (this.isClass(i, classification.Adjetive))
    {
      const j = i + 1;
      const result = this.matchTerm(j);
      if (result > j) return result;
    }

    const result = this.matchTerm(i);
    return result === i ? state : result;
  }

  matchTerm (i)
  {
    if (!this.isClass(i, classification.Noun)) return i;

    if (this.isClass(i + 1, classification.Preposition))
    {
      const state = i + 2;
      const result = this.matchTerm(state);
      if (result > state) return result;
    }

    return i + 1;
  }

  matchPredicate (i)
  {
    if (!this.isClass(i, classification.Verb)) return i;
    else return this.matchComplement(i + 1);
  }

  matchComplement (i)
  {
    if (this.isClass(i, classification.Article, classification.Preposition))
    {
      const j = i + 1;
      i = this.matchTerm(j);
      if (i === j) return j - 1;
    }

    return this.isClass(i, classification.Adverb) ? i + 1 : i;
  }
}


exports.Analyser = SyntacticAnalyser;
exports.Error = SyntacticError;
exports.analyse = function (tokens) {
  new SyntacticAnalyser().analyse(tokens);
}