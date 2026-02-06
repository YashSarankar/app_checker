# 🌐 Custom Domain Setup Guide: Sarankar.com

## ✅ Your App is Live!
- **Production URL**: https://app-checker-ten.vercel.app
- **Custom Domain**: Sarankar.com (we'll set this up now)

---

## 📋 Step 1: Add Domain in Vercel Dashboard

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/yashsarankars-projects/app-checker
   - Or: https://vercel.com → Select "app-checker" project

2. **Go to Settings**:
   - Click on your project "app-checker"
   - Click **"Settings"** tab
   - Click **"Domains"** in the left sidebar

3. **Add Your Domain**:
   - Type: `sarankar.com`
   - Click **"Add"**
   - Also add: `www.sarankar.com` (recommended)

4. **Vercel will show DNS records** you need to add

---

## 📋 Step 2: Configure DNS (At Your Domain Registrar)

You need to add DNS records where you bought **Sarankar.com** (GoDaddy, Namecheap, Cloudflare, etc.)

### **For Root Domain (sarankar.com):**

**Option A: Using A Records (Most Common)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Option B: Using CNAME (If supported)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

### **For WWW Subdomain (www.sarankar.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 🔧 Step 3: DNS Configuration by Provider

### **If using GoDaddy:**
1. Go to: https://dcc.godaddy.com/manage/SARANKAR.COM/dns
2. Click **"Add"** under DNS Records
3. Add the A record and CNAME record from above
4. Click **"Save"**

### **If using Namecheap:**
1. Go to: Domain List → Manage → Advanced DNS
2. Click **"Add New Record"**
3. Add the records from above
4. Click **"Save All Changes"**

### **If using Cloudflare:**
1. Go to: DNS → Records
2. Click **"Add record"**
3. Add the records (make sure proxy is OFF/DNS only)
4. Click **"Save"**

### **If using Google Domains:**
1. Go to: DNS → Custom records
2. Add the A and CNAME records
3. Click **"Save"**

---

## ⏱️ Step 4: Wait for DNS Propagation

- **Time**: 5 minutes to 48 hours (usually 10-30 minutes)
- **Check status**: https://dnschecker.org/#A/sarankar.com

---

## ✅ Step 5: Verify in Vercel

1. Go back to Vercel Dashboard → Domains
2. Wait for the status to change from "Pending" to "Valid"
3. Once valid, your site will be live at **sarankar.com**!

---

## 🎯 Quick Command (Alternative Method)

You can also add domain via CLI:

```bash
npx vercel domains add sarankar.com
npx vercel domains add www.sarankar.com
```

Then follow the DNS instructions shown.

---

## 🔒 SSL Certificate

Vercel automatically provides FREE SSL certificates!
- ✅ Your site will be **https://sarankar.com** (secure)
- ✅ Auto-renews every 90 days
- ✅ No configuration needed

---

## 🚨 Common Issues

### Issue 1: "Domain already in use"
**Solution**: Remove domain from old project first
```bash
npx vercel domains rm sarankar.com --scope=old-project
```

### Issue 2: "DNS not configured"
**Solution**: 
- Double-check DNS records
- Wait 30 minutes for propagation
- Use https://dnschecker.org to verify

### Issue 3: "www not working"
**Solution**: Make sure you added BOTH:
- `sarankar.com` (root)
- `www.sarankar.com` (www)

---

## 📊 Final Setup

Once DNS is configured, your app will be accessible at:
- ✅ https://sarankar.com
- ✅ https://www.sarankar.com
- ✅ https://app-checker-ten.vercel.app (still works)

---

## 🎉 Next Steps After Domain is Live

1. **Update AdSense**: Use `sarankar.com` when applying
2. **Add Analytics**: Track visitors on your custom domain
3. **Share**: Your professional URL is ready!

---

## 📝 DNS Records Summary

Copy these to your DNS provider:

```
# Root domain
Type: A
Name: @
Value: 76.76.21.21

# WWW subdomain  
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🆘 Need Help?

**Where did you buy Sarankar.com?**
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Other?

Let me know and I'll give you specific instructions for your provider!

---

**Your app is ready! Just add the DNS records and wait 10-30 minutes.** 🚀
