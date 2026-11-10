import re
from typing import Dict, Tuple, List, Any

# Varhadi dialect lexical mapping to Standard Marathi
VARHADI_TO_STANDARD_MARATHI: Dict[str, str] = {
    # Pronouns & dative markers
    "मले": "मला",
    "म्हाले": "मला",
    "तुले": "तुला",
    "त्याले": "त्याला",
    "ह्याले": "याला",
    "आम्हाले": "आम्हाला",
    "तुम्हाले": "तुम्हाला",
    
    # Interrogatives & adverbs
    "काऊन": "का",
    "कायले": "कशासाठी",
    "कठे": "कोठे",
    "कवा": "केव्हा",
    "कस्तं": "कसे",
    "कसा काय": "कसा",
    
    # Verbs & auxiliaries
    "व्हय": "आहे",
    "न्हाई": "नाही",
    "नाय": "नाही",
    "व्हता": "होता",
    "व्हती": "होती",
    "व्हतं": "होते",
    "पायजे": "पाहिजे",
    "पाह्यजे": "पाहिजे",
    "भेटाले": "मिळायला",
    "भेटन": "मिळेल",
    "भेटत": "मिळत",
    "करायले": "करायला",
    "सांगाले": "सांगायला",
    "गेलतो": "गेलो होतो",
    "गेलता": "गेला होता",
    
    # Quantifiers & Demonstratives
    "इतलं": "इतके",
    "तितलं": "तितके",
    "कितलं": "किती",
    
    # Farming & administrative terms
    "कागदपत्तुर": "कागदपत्रे",
    "कागद": "कागदपत्रे",
    "पयशे": "पैसे",
    "रुपये": "रुपये",
    "वावर": "शेत",
    "नुकसानी": "नुकसान",
    "खातं": "खाते",
    "साताबारा": "७/१२ उतारा",
    "सातबारा": "७/१२ उतारा",
    "आठा": "८-अ उतारा"
}

# Marathi-English Government & Agricultural Terminology Glossary
GLOSSARY_MARATHI_ENGLISH: Dict[str, str] = {
    "शेतकरी कर्जमाफी": "Farmer Loan Waiver",
    "कर्जमाफी": "Loan Waiver",
    "पीक विमा": "Crop Insurance",
    "पंतप्रधान पीक विमा योजना": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    "शासकीय अनुदान": "Government Subsidy",
    "अनुदान": "Subsidy / Grant",
    "नमो शेतकरी महासन्मान निधी": "Namo Shetkari Mahasanman Nidhi",
    "पीएम किसान": "PM-KISAN Samman Nidhi",
    "सातबारा उतारा": "7/12 Land Record (Record of Rights)",
    "८-अ उतारा": "8-A Land Extract",
    "आधार संलग्न बँक खाते": "Aadhaar-seeded Bank Account",
    "थेट लाभ हस्तांतरण": "Direct Benefit Transfer (DBT)",
    "महाडीबीटी": "MahaDBT Portal",
    "पात्रता निकष": "Eligibility Criteria",
    "आवश्यक कागदपत्रे": "Required Documents",
    "अर्ज प्रक्रिया": "Application Procedure",
    "अतिवृष्टी नुकसान भरपाई": "Excess Rainfall Damage Compensation",
    "ठिबक सिंचन अनुदान": "Drip Irrigation Subsidy",
    "तुषार सिंचन": "Sprinkler Irrigation",
    "कृषी पंप वीज जोडणी": "Agricultural Pump Electricity Connection",
    "गोपीनाथ मुंडे शेतकरी अपघात सुरक्षा सानुग्रह अनुदान": "Gopinath Munde Farmer Accident Insurance Scheme",
    "तालुका कृषी अधिकारी": "Taluka Agriculture Officer",
    "ग्रामसेवक": "Gram Sevak / Village Officer",
    "तलाठी": "Talathi / Revenue Officer"
}

def detect_language_and_dialect(text: str) -> Dict[str, Any]:
    """
    Detects whether text is Standard Marathi, Varhadi dialect,
    Marathi-English code-switched, or English based on vocabulary presence.
    """
    if not text or not text.strip():
        return {
            "primary_language": "unknown",
            "dialect": "unknown",
            "is_code_switched": False,
            "varhadi_score": 0.0
        }

    # Check Devanagari character presence
    devanagari_chars = len(re.findall(r'[\u0900-\u097F]', text))
    latin_chars = len(re.findall(r'[a-zA-Z]', text))
    total_chars = max(len(text.replace(" ", "")), 1)

    is_predominantly_latin = (latin_chars / total_chars) > 0.65
    is_code_switched = (latin_chars > 3) and (devanagari_chars > 3)

    if is_predominantly_latin:
        return {
            "primary_language": "en",
            "dialect": "Standard English",
            "is_code_switched": is_code_switched,
            "varhadi_score": 0.0
        }

    # Detect Varhadi dialect marker tokens
    words = text.split()
    varhadi_matches = []
    for word in words:
        clean_w = re.sub(r'[^\u0900-\u097F]', '', word)
        if clean_w in VARHADI_TO_STANDARD_MARATHI:
            varhadi_matches.append(clean_w)

    varhadi_ratio = len(varhadi_matches) / max(len(words), 1)
    is_varhadi = len(varhadi_matches) >= 1 or varhadi_ratio > 0.08

    return {
        "primary_language": "mr",
        "dialect": "Varhadi (Vidarbha)" if is_varhadi else "Standard Marathi",
        "is_code_switched": is_code_switched,
        "varhadi_score": round(varhadi_ratio, 3),
        "detected_markers": varhadi_matches
    }

def normalize_varhadi_to_marathi(original_text: str) -> Tuple[str, List[Dict[str, str]]]:
    """
    Normalizes Varhadi dialectal expressions into standard Marathi for downstream processing.
    CRITICAL: Preserves the original text completely and returns substitutions separately.
    Does not replace names, numbers, or standard words.
    """
    if not original_text:
        return "", []

    tokens = original_text.split()
    normalized_tokens = []
    replacements_made = []

    for token in tokens:
        # Separate punctuation if any
        match = re.match(r'^([^\u0900-\u097F]*)([\u0900-\u097F]+)([^\u0900-\u097F]*)$', token)
        if match:
            prefix, core_word, suffix = match.groups()
            if core_word in VARHADI_TO_STANDARD_MARATHI:
                standard_equiv = VARHADI_TO_STANDARD_MARATHI[core_word]
                normalized_tokens.append(f"{prefix}{standard_equiv}{suffix}")
                replacements_made.append({
                    "original": core_word,
                    "normalized": standard_equiv
                })
            else:
                normalized_tokens.append(token)
        else:
            normalized_tokens.append(token)

    normalized_text = " ".join(normalized_tokens)
    return normalized_text, replacements_made

