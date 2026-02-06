# 🎯 Namecheap DNS Setup for Sarankar.com

## 📋 Step-by-Step Instructions:

### **Step 1: Login to Namecheap**
1. Go to: **https://www.namecheap.com**
2. Click **"Sign In"** (top right)
3. Enter your username and password

---

### **Step 2: Access Domain Management**
1. Click **"Domain List"** in the left sidebar
2. Find **"Sarankar.com"** in your list
3. Click **"Manage"** button next to it

---

### **Step 3: Go to Advanced DNS**
1. Click the **"Advanced DNS"** tab at the top
2. You'll see your current DNS records

---

### **Step 4: Remove Conflicting Records (If Any)**

Look for existing records with these types and remove them:
- Any **A Record** with Host "@" or "sarankar.com"
- Any **CNAME Record** with Host "www"
- Any **URL Redirect Records**

**To remove:**
- Click the **trash icon** 🗑️ next to each record
- Click **"Yes, delete"** to confirm

---

### **Step 5: Add New A Record (Root Domain)**

1. Click **"Add New Record"** button
2. Fill in:
   - **Type**: Select `A Record`
   - **Host**: Type `@`
   - **Value**: Type `76.76.21.21`
   - **TTL**: Select `Automatic` (or `3600`)
3. Click the **green checkmark** ✅ to save

---

### **Step 6: Add New CNAME Record (WWW)**

1. Click **"Add New Record"** button again
2. Fill in:
   - **Type**: Select `CNAME Record`
   - **Host**: Type `www`
   - **Value**: Type `cname.vercel-dns.com`
   - **TTL**: Select `Automatic` (or `3600`)
3. Click the **green checkmark** ✅ to save

---

### **Step 7: Save All Changes**

1. Scroll to the bottom of the page
2. Click the **"Save All Changes"** button
3. You'll see a green success message

---

## ✅ Your DNS Records Should Look Like This:

```
┌──────────┬──────┬─────────────────────┬──────────┐
│ Type     │ Host │ Value               │ TTL      │
├──────────┼──────┼─────────────────────┼──────────┤
│ A Record │ @    │ 76.76.21.21         │ Automatic│
│ CNAME    │ www  │ cname.vercel-dns.com│ Automatic│
└──────────┴──────┴─────────────────────┴──────────┘
```

---

## ⏱️ Wait for Propagation

**Time needed**: 5-30 minutes (usually 10-15 minutes with Namecheap)

### **Check if it's working:**

1. **Option A - DNS Checker:**
   - Visit: https://dnschecker.org/#A/sarankar.com
   - Look for green checkmarks showing `76.76.21.21`

2. **Option B - Command Line:**
   ```bash
   nslookup sarankar.com
   ```
   Should show: `76.76.21.21`

3. **Option C - Just Try It:**
   - Open browser
   - Go to: https://sarankar.com
   - If it loads your app, you're done! 🎉

---

## 🚨 Common Namecheap Issues:

### **Issue 1: "Record already exists"**
**Solution**: Delete the old record first, then add the new one

### **Issue 2: "Changes not saving"**
**Solution**: 
- Make sure you clicked the green checkmark ✅ for each record
- Then click "Save All Changes" at the bottom

### **Issue 3: "Still showing old site"**
**Solution**: 
- Clear browser cache (Ctrl + Shift + Delete)
- Try incognito/private mode
- Wait another 10 minutes

### **Issue 4: "SSL/HTTPS not working"**
**Solution**: 
- Wait 24 hours for Vercel to issue SSL certificate
- Certificate is automatic, no action needed

---

## 🔒 Important Namecheap Settings:

### **Make sure these are correct:**

1. **Nameservers** should be:
   - `dns1.registrar-servers.com`
   - `dns2.registrar-servers.com`
   
   (These are Namecheap's default - don't change them!)

2. **DNSSEC** should be: `OFF`
   - If it's ON, turn it OFF for now

---

## ✅ After DNS is Working:

Your app will be live at:
- ✅ **https://sarankar.com**
- ✅ **https://www.sarankar.com**

Both will show your AppRank Pro application!

---

## 🎯 Next Steps:

1. ✅ Add DNS records (you're doing this now)
2. ⏰ Wait 10-15 minutes
3. 🧪 Test: Visit https://sarankar.com
4. 📝 Apply to Google AdSense using sarankar.com
5. 💰 Start earning!

---

## 📸 Visual Guide:

**What you're looking for in Namecheap:**

```
Advanced DNS Tab
├── A Record
│   ├── Host: @
│   ├── Value: 76.76.21.21
│   └── TTL: Automatic
│
└── CNAME Record
    ├── Host: www
    ├── Value: cname.vercel-dns.com
    └── TTL: Automatic
```

---

## 🆘 Still Need Help?

If you're stuck:
1. Take a screenshot of your Advanced DNS page
2. Let me know what error you're seeing
3. I'll help you troubleshoot!

---

**Go ahead and add those 2 records now! It takes just 2 minutes.** 🚀

After you save, come back and let me know - I'll help you verify it's working!
