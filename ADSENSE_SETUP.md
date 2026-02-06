# 🚀 Complete Google AdSense Setup Guide

## 📋 Prerequisites
- ✅ Your website must be live (deployed, not localhost)
- ✅ You need a Google account
- ✅ Your site should have original content
- ✅ Age 18+ (or have parental consent)

---

## Step 1: Sign Up for Google AdSense

### 1.1 Create Account
1. Go to **https://www.google.com/adsense**
2. Click **"Get Started"**
3. Sign in with your Google account
4. Fill in the form:
   - **Website URL**: `https://yourdomain.com` (your deployed site)
   - **Email**: Your email for important updates
   - **Country**: Your country
5. Accept Terms & Conditions
6. Click **"Create Account"**

### 1.2 Connect Your Site
1. AdSense will give you a **verification code** like this:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```
2. **Copy this entire code** (we'll add it in Step 2)

---

## Step 2: Add AdSense Code to Your Website

### 2.1 Add Global AdSense Script

Open `src/app/layout.js` and add the script to the `<head>`:

```javascript
import Script from 'next/script'

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
```

**Replace `ca-pub-XXXXXXXXXXXXXXXX` with YOUR actual Publisher ID from Step 1.2**

### 2.2 Deploy Your Site
1. Commit your changes:
```bash
git add .
git commit -m "Add AdSense verification code"
git push
```

2. Deploy to your hosting (Vercel/Netlify/etc.)
3. Wait 5-10 minutes for deployment

### 2.3 Verify in AdSense Dashboard
1. Go back to **AdSense dashboard**
2. Click **"I've placed the code"** or **"Verify"**
3. Wait for verification (can take 24-48 hours)

---

## Step 3: Wait for Approval

### What Happens Now:
- ✅ AdSense reviews your site (1-7 days, sometimes up to 2 weeks)
- ✅ They check for:
  - Original content
  - Privacy policy page
  - Sufficient content (at least 10-15 pages recommended)
  - No prohibited content

### While Waiting:
- ❌ **Don't** click your own ads
- ✅ **Do** add more content to your site
- ✅ **Do** add a Privacy Policy page (required!)

---

## Step 4: Create Ad Units (After Approval)

Once approved, you'll get an email. Then:

### 4.1 Create Banner Ad Unit
1. Go to **AdSense Dashboard** → **Ads** → **By ad unit**
2. Click **"+ New ad unit"** → **"Display ads"**
3. Configure:
   - **Name**: `AppRank Banner Ad`
   - **Ad size**: Responsive (recommended) or 728x90
   - **Ad type**: Display ads
4. Click **"Create"**
5. **Copy the Ad Slot ID** (looks like `1234567890`)

### 4.2 Create Inline Ad Unit
1. Click **"+ New ad unit"** → **"Display ads"**
2. Configure:
   - **Name**: `AppRank Inline Ad`
   - **Ad size**: Responsive
   - **Ad type**: Display ads
3. Click **"Create"**
4. **Copy the Ad Slot ID**

---

## Step 5: Update Your Code with Real Ads

### 5.1 Open `src/components/AdUnit.js`

### 5.2 Uncomment and Update the AdSense Code

Replace the placeholder code with real AdSense code:

```javascript
'use client'

import React, { useEffect } from 'react'

export default function AdUnit({ slot, format = 'auto', style = {} }) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className="ad-container" style={style}>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot={slot}
                 data-ad-format={format}
                 data-full-width-responsive="true"></ins>
        </div>
    )
}

// Banner Ad Component (728x90 or responsive)
export function BannerAd() {
    return (
        <AdUnit 
            slot="1234567890"  // ← Replace with YOUR Banner Ad Slot ID
            format="horizontal"
            style={{ minHeight: '90px', maxHeight: '120px' }}
        />
    )
}

// Inline Ad Component (Responsive)
export function InlineAd() {
    return (
        <AdUnit 
            slot="0987654321"  // ← Replace with YOUR Inline Ad Slot ID
            format="auto"
            style={{ minHeight: '100px' }}
        />
    )
}
```

### 5.3 Replace These Values:
1. **`ca-pub-XXXXXXXXXXXXXXXX`** → Your Publisher ID (from Step 1.2)
2. **`slot="1234567890"`** → Your Banner Ad Slot ID (from Step 4.1)
3. **`slot="0987654321"`** → Your Inline Ad Slot ID (from Step 4.2)

---

## Step 6: Deploy and Test

### 6.1 Deploy
```bash
git add .
git commit -m "Connect AdSense ads"
git push
```

### 6.2 Test (IMPORTANT!)
1. Open your live site (not localhost!)
2. Check if ads appear (may take 10-30 minutes)
3. **DO NOT** click your own ads (AdSense will ban you!)
4. Use **AdSense Preview Tool** to test safely

### 6.3 Check AdSense Dashboard
- Go to **Reports** to see impressions
- Ads may show as blank initially (normal)
- Real ads appear within 24 hours

---

## 🚨 Common Issues & Solutions

### Issue 1: "Ads not showing"
**Solutions:**
- Wait 24-48 hours after deployment
- Check browser console for errors
- Verify Publisher ID is correct
- Disable ad blockers

### Issue 2: "Account not approved"
**Reasons:**
- Not enough content (add more pages)
- Missing Privacy Policy
- Site not accessible
- Duplicate content

**Fix:** Address the issues and reapply after 7 days

### Issue 3: "Ads showing blank boxes"
**This is normal!** AdSense needs time to:
- Analyze your content
- Match relevant ads
- Build advertiser demand

**Wait 24-72 hours** for real ads to appear.

---

## 📊 Monitoring Your Earnings

### Daily Checks:
1. Go to **AdSense Dashboard** → **Reports**
2. Check:
   - **Impressions**: How many times ads were shown
   - **Clicks**: How many times ads were clicked
   - **CTR**: Click-through rate (1-3% is good)
   - **Earnings**: Your revenue

### Optimization Tips:
- ✅ Monitor which ad performs best
- ✅ Adjust ad placements based on data
- ✅ A/B test different positions
- ❌ Never click your own ads
- ❌ Never ask users to click ads

---

## 💰 Payment Setup

### When You Reach $10:
1. AdSense will ask to **verify your address**
2. They'll send a **PIN by mail** (2-4 weeks)
3. Enter PIN in AdSense dashboard

### When You Reach $100:
1. Add **payment method** (bank account or check)
2. Payments are sent **monthly** (around 21st of each month)
3. Minimum payout: **$100**

---

## ✅ Quick Checklist

Before going live:
- [ ] AdSense account created
- [ ] Verification code added to `layout.js`
- [ ] Site deployed and live
- [ ] Account approved by AdSense
- [ ] Ad units created (Banner + Inline)
- [ ] Ad slot IDs added to `AdUnit.js`
- [ ] Publisher ID updated in both files
- [ ] Code deployed to production
- [ ] Ads tested on live site
- [ ] Privacy Policy page added

---

## 🆘 Need Help?

**AdSense Support:**
- Help Center: https://support.google.com/adsense
- Community Forum: https://support.google.com/adsense/community

**Your Code Files to Update:**
1. `src/app/layout.js` - Add global AdSense script
2. `src/components/AdUnit.js` - Add ad slot IDs

---

## 🎉 You're All Set!

Once everything is connected, your ads will start showing and you'll begin earning! 

**Expected Timeline:**
- Day 1: Apply to AdSense
- Day 2-7: Wait for approval
- Day 8: Create ad units
- Day 9: Deploy code with real ads
- Day 10+: Start earning!

Good luck! 🚀💰
