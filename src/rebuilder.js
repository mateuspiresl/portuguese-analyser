const lexical = require('../src/lexical');
const syntactic = require('../src/syntactic');
const classification = require('../src/classification');


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
// ver com adv, suj = brincam de bola de gude semanalmente, os felizes amigos de João

function slice (tokens, interval) {
  return interval ? tokens.slice(interval[0], interval[1]).map(pair => pair.token).join(' ') : undefined;
}

function rebuildFor_suj_ver_com_adv (tokens, suj, ver, com, adv)
{
  return [
    `${suj} ${ver} ${com} ${adv}.`,
    `${suj} ${adv} ${ver} ${com}.`,
    `${suj} ${ver} ${adv} ${com}.`,
    `${com}, ${adv} ${ver} ${suj}.`,
    `${com}, ${ver} ${adv} ${suj}.`,
    `${suj}, ${com}, ${adv} ${ver}.`,
    `${suj}, ${com}, ${ver} ${adv}.`,
    `${ver} ${com} ${adv}, ${suj}.`,
    `${adv} ${ver} ${com}, ${suj}.`,
    `${ver} ${adv} ${com}, ${suj}.`
  ];
}

function rebuildFor_suj_ver_adv (tokens, suj, ver, adv)
{
  return [
    `${suj} ${ver} ${adv}.`,
    `${suj} ${adv} ${ver}.`,
    `${adv} ${ver}, ${suj}.`,
    `${ver} ${adv}, ${suj}.`
  ];
}

function rebuildFor_suj_ver_com (tokens, suj, ver, com)
{
  return [
    `${suj} ${ver} ${com}.`,
    `${com}, ${ver} ${suj}.`,
    `${suj}, ${com}, ${ver}.`,
    `${ver} ${com}, ${suj}.`
  ];
}

function rebuildFor_suj_ver (tokens, suj, ver)
{
  return [
    `${suj} ${ver}.`,
    `${ver}, ${suj}.`
  ];
}

function rebuildFor_ver_com_adv (tokens, ver, com, adv)
{
  return [
    `${ver} ${com} ${adv}.`,
    `${adv} ${ver} ${com}.`,
    `${ver} ${adv} ${com}.`,
    `${com}, ${adv} ${ver}.`,
    `${com}, ${ver} ${adv}.`
  ];
}

function rebuildFor_ver_adv (tokens, ver, adv)
{
  return [
    `${ver} ${adv}.`,
    `${adv} ${ver}.`
  ];
}

function rebuildFor_ver_com (tokens, ver, com)
{
  return [
    `${ver} ${com}.`,
    `${com}, ${ver}.`
  ];
}

module.exports = async function (phrase)
{
  const analysis = syntactic.analyse(await lexical(phrase));
  const suj = slice(analysis.tokens, analysis.subject);
  const ver = slice(analysis.tokens, analysis.verb);
  const com = slice(analysis.tokens, analysis.complement);
  const adv = slice(analysis.tokens, analysis.adverb);

  if (suj && ver && com && adv)
    return rebuildFor_suj_ver_com_adv(analysis.tokens, suj, ver, com, adv);

  if (suj && ver && adv)
    return rebuildFor_suj_ver_adv(analysis.tokens, suj, ver, adv);

  if (suj && ver && com)
    return rebuildFor_suj_ver_com(analysis.tokens, suj, ver, com);

  if (suj && ver)
    return rebuildFor_suj_ver(analysis.tokens, suj, ver);
    
  if (ver && com && adv)
    return rebuildFor_ver_com_adv(analysis.tokens, ver, com, adv);

  if (ver && adv)
    return rebuildFor_ver_adv(analysis.tokens, ver, adv);

  if (ver && com)
    return rebuildFor_ver_com(analysis.tokens, ver, com);
  
  if (ver)
    return [ver];
}