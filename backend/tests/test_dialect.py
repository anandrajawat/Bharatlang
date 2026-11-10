import pytest
from backend.app.services.translation.normalization import (
    detect_language_and_dialect,
    normalize_varhadi_to_marathi,
    GLOSSARY_MARATHI_ENGLISH,
    VARHADI_TO_STANDARD_MARATHI
)

def test_varhadi_dialect_detection():
    varhadi_text = "मले शेतीसाठी कर्जमाफी आणि अनुदान कसं भेटन ते सांगा."
    res = detect_language_and_dialect(varhadi_text)
    assert res["primary_language"] == "mr"
    assert "Varhadi" in res["dialect"]
    assert res["is_code_switched"] is False

def test_standard_marathi_detection():
    marathi_text = "नमो शेतकरी महासन्मान निधी योजनेसाठी पात्रता निकष काय आहेत?"
    res = detect_language_and_dialect(marathi_text)
    assert res["primary_language"] == "mr"
    assert "Standard Marathi" in res["dialect"]

def test_non_destructive_varhadi_normalization():
    original = "म्हाले कापूस नुकसानीचे पयशे कवा भेटतील?"
    normalized, replacements = normalize_varhadi_to_marathi(original)
    
    # Original is preserved intact
    assert original == "म्हाले कापूस नुकसानीचे पयशे कवा भेटतील?"
    
    # Normalized replaces dialect markers
    assert "मला" in normalized
    assert "पैसे" in normalized
    assert "केव्हा" in normalized
    
    # Replacements list records exact substitutions
    rep_dict = {r["original"]: r["normalized"] for r in replacements}
    assert rep_dict["म्हाले"] == "मला"
    assert rep_dict["पयशे"] == "पैसे"
    assert rep_dict["कवा"] == "केव्हा"

def test_glossary_presence():
    assert "शेतकरी कर्जमाफी" in GLOSSARY_MARATHI_ENGLISH
    assert "पीक विमा" in GLOSSARY_MARATHI_ENGLISH
    assert "नमो शेतकरी महासन्मान निधी" in GLOSSARY_MARATHI_ENGLISH

