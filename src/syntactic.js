const classification = require('./classification');


const phraseDelimitierRegex = /^(\.|!|\?|,)$/;
const phraseEndDelimitierRegex = /^(\.|!|\?)$/;

class SyntacticError extends Error {
  constructor (message) { super(message); }
}

class SyntacticAnalyser
{
  constructor (tokens)
  {
    this.tokens = tokens;
    // this.tokens.forEach((token, i) => console.log('TOKEN (%s): %s', i, JSON.stringify(token)));
  }

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
    const thisClass = this.getClass(i);

    for (let i = 0; i < classes.length; i++)
      if (classes[i] === thisClass)
        return true;
    
    return false;
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

  analyse ()
  {
    let i = this.matchMultiplePhrase(0);
    
    if (!this.isPhraseEndDelimitier(i))
      throw new SyntacticError('Missing end punctuation');

    if (this.has(i + 1))
      throw new SyntacticError('Remaining content');

    return this;
  }

  matchMultiplePhrase (i)
  {
    const state = i;
    i = this.matchPhrase(i);

    if (state === i)
      throw new SyntacticError('Didn\'t find a phrase');

    // console.log('Found phrase (%d): %s', i, this.tokens.slice(state, i).map(token => token.token));

    if (this.isPhraseDelimitier(i) && this.has(i + 1) && this.isWord(i + 1))
      return this.matchMultiplePhrase(i + 1);
    
    return i;
  }

  matchPhrase (i)
  {
    const subjectBegin = i;
    i = this.matchSubject(i);
    if (i !== subjectBegin) this.subject = [subjectBegin, i];

    // console.log('Found subject (%d): %s', i, this.tokens.slice(subjectBegin, i).map(token => token.token));

    const predicateBegin = i;
    i = this.matchPredicate(i);
    if (i === predicateBegin) return subjectBegin;
    this.predicate = [predicateBegin, i];

    // console.log('Found predicate (%d): %s', i, this.tokens.slice(predicateBegin, i).map(token => token.token));

    return i;
  }

  // ter = [adj] sub [adj] [pre ter]
  // suj = [art] ter
  // com = [pre] suj
  // prd = [adv] ver com [adv]
  // phr = suj prd

  // suj ver com adv = os felizes amigos de João brincam de bola de gude semanalmente
  // suj = os felizes amigos de João
  // ver = brincam
  // com = de bola de gude
  // adv = semanalmente
  // com, adv ver suj = de bola de gude, semanalmente brincam os felizes amigos de João
  // suj, com, adv ver = os felizes amigos de João, de bola de gude, semanalmente brincam
  // com adv, suj = brincam de bola de gude semanalmente, os felizes amigos de João

  matchSubject (i)
  {
    // console.log('\tMatching subject (%d)...', i)

    const state = i;

    if (this.isClass(i, classification.Article)) i++;
    if (this.isClass(i, classification.Adjetive))
    {
      const j = i + 1;
      const result = this.matchTerm(j);
      // console.log('\tFrom %d, term result: %d', j, result);
      if (result > j) return result;
    }

    const result = this.matchTerm(i);
    return result === i ? state : result;
  }

  matchTerm (i)
  {
    // console.log('\tMatching term (%d)...', i)
    
    const begin = i;
    if (this.isClass(i, classification.Adjetive)) i++;
    if (!this.isClass(i, classification.Noun)) return begin;
    if (this.isClass(++i, classification.Adjetive)) i++;
    
    // console.log('Found noun (%d): %s', i, this.getToken(i));

    if (this.isClass(i, classification.Preposition))
    {
      const result = this.matchTerm(i + 1);
      // console.log('\tFrom %d, term result: %d', state, result);
      if (result > i + 1) return result;
    }

    return i;
  }

  matchPredicate (i)
  {
    // console.log('\tMatching predicate (%d)...', i)

    const begin = i;
    if (this.isClass(i, classification.Adverb))
    {
      this.adverb = [i, i + 1];
      i++;
    }

    if (!this.isClass(i, classification.Verb))
      return begin;

    this.verb = [i, i + 1];
    
    const beforeComplement = i + 1;
    i = this.matchComplement(beforeComplement);
    
    if (i !== beforeComplement)
      this.complement = [beforeComplement, i];

    if (this.isClass(i, classification.Adverb) && this.adverb === undefined)
    {
      this.adverb = [i, i + 1];
      return i + 1;
    }

    return i;
  }

  matchComplement (i)
  {
    // console.log('\tMatching complement (%d)...', i)
    
    const begin = i;
    if (this.isClass(i, classification.Preposition)) i++;

    if (i === begin && !this.isClass(i, classification.Article))
      return begin;
    
    const result = this.matchSubject(i);
    // console.log('\tFrom %d, subject result: %d', beforeSubject, i);
    return result === i ? begin : result;
  }
}


exports.Analyser = SyntacticAnalyser;
exports.Error = SyntacticError;
exports.analyse = function (tokens) {
  return new SyntacticAnalyser(tokens).analyse();
}