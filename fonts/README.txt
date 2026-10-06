Optional: self-host the handwriting fonts (no Google connection, GDPR-safe).
1. Download Caveat and Patrick Hand from fonts.google.com (Download family), convert or take the .woff2 files.
2. Put them here as Caveat.woff2 and PatrickHand.woff2.
3. Add to the top of style.css:
@font-face{font-family:Caveat;font-weight:600 700;src:url(fonts/Caveat.woff2) format('woff2');font-display:swap}
@font-face{font-family:'Patrick Hand';src:url(fonts/PatrickHand.woff2) format('woff2');font-display:swap}
Without them the site uses handwriting fonts already on the device.
