# 🚀 Setup rank.sarankar.com - Complete Guide

## ✅ Your Subdomain: rank.sarankar.com

Perfect choice for AppRank Checker!

---

## 📋 STEP-BY-STEP SETUP

### **PART 1: Add Domain in Vercel Dashboard**

#### Step 1: Go to Vercel Dashboard
1. Open browser and go to: **https://vercel.com/yashsarankars-projects/app-checker**
2. Login if needed

#### Step 2: Navigate to Domains
1. Click on your project **"app-checker"**
2. Click **"Settings"** tab at the top
3. Click **"Domains"** in the left sidebar

#### Step 3: Add Your Subdomain
1. In the "Add Domain" field, type: **`rank.sarankar.com`**
2. Click **"Add"** button
3. Vercel will show you the DNS configuration needed

---

### **PART 2: Configure DNS in Namecheap**

#### Step 1: Login to Namecheap
1. Go to: **https://www.namecheap.com**
2. Click **"Sign In"**
3. Enter your credentials

#### Step 2: Access Domain DNS
1. Click **"Domain List"** in left sidebar
2. Find **"Sarankar.com"**
3. Click **"Manage"** button

#### Step 3: Go to Advanced DNS
1. Click **"Advanced DNS"** tab at the top

#### Step 4: Add CNAME Record for Subdomain
1. Click **"Add New Record"** button
2. Fill in:
   - **Type**: Select `CNAME Record`
   - **Host**: Type `rank`
   - **Value**: Type `cname.vercel-dns.com`
   - **TTL**: Select `Automatic`
3. Click the **green checkmark** ✅

#### Step 5: Save Changes
1. Scroll to bottom
2. Click **"Save All Changes"** button
3. Wait for green success message

---

## ✅ Your DNS Record Should Look Like:

```
┌─────────┬──────┬─────────────────────┬──────────┐
│ Type    │ Host │ Value               │ TTL      │
├─────────┼──────┼─────────────────────┼──────────┤
│ CNAME   │ rank │ cname.vercel-dns.com│ Automatic│
└─────────┴──────┴─────────────────────┴──────────┘
```

---

## ⏱️ Wait for DNS Propagation

**Time needed**: 5-15 minutes

### Check if it's working:

**Option 1 - DNS Checker:**
- Visit: https://dnschecker.org/#CNAME/rank.sarankar.com
- Look for green checkmarks showing `cname.vercel-dns.com`

**Option 2 - Just Try It:**
- Wait 10 minutes
- Open browser
- Go to: **https://rank.sarankar.com**
- If it loads your app, you're done! 🎉

---

## 🎯 After Setup is Complete:

Your app will be accessible at:
- ✅ **https://rank.sarankar.com** (your main URL)
- 🔗 **https://app-checker-ten.vercel.app** (backup URL)

---

## 🔒 SSL Certificate:
- ✅ Automatically provided by Vercel (FREE)
- ✅ Your site will be HTTPS (secure)
- ✅ Usually ready within 24 hours

---

## 📝 Summary:

**What you need to do:**

1. **Vercel Dashboard**:
   - Go to: https://vercel.com/yashsarankars-projects/app-checker/settings/domains
   - Add domain: `rank.sarankar.com`

2. **Namecheap DNS**:
   - Go to: Domain List → Manage → Advanced DNS
   - Add CNAME record:
     - Host: `rank`
     - Value: `cname.vercel-dns.com`
   - Save changes

3. **Wait**: 10-15 minutes

4. **Test**: Visit https://rank.sarankar.com

---

## 🚨 Troubleshooting:

### "Domain already in use"
- Remove it from old project first
- Then add to app-checker project

### "DNS not configured"
- Double-check the CNAME record
- Make sure Host is exactly: `rank`
- Make sure Value is exactly: `cname.vercel-dns.com`
- Wait another 10 minutes

### "SSL certificate pending"
- This is normal
- Wait up to 24 hours
- Certificate will be issued automatically

---

## ✅ Checklist:

- [ ] Added `rank.sarankar.com` in Vercel Dashboard
- [ ] Added CNAME record in Namecheap
- [ ] Saved all changes
- [ ] Waited 10-15 minutes
- [ ] Tested https://rank.sarankar.com
- [ ] App is live! 🎉

---

## 🎉 Next Steps After Domain is Live:

1. **Apply to Google AdSense**:
   - Use URL: `https://rank.sarankar.com`
   - Follow the guide in `ADSENSE_SETUP.md`

2. **Share Your App**:
   - Professional URL ready!
   - Start promoting your tool

3. **Monitor Traffic**:
   - Add Google Analytics (optional)
   - Track your users

---

**Start with Part 1 (Vercel Dashboard), then Part 2 (Namecheap DNS)!** 🚀

Let me know once you've added the domain in Vercel and I'll help verify!
