# 🔧 Install Required Software - CineBook

## Current Issues Detected:
- ❌ Maven is NOT installed (required to run backend)
- ❌ MongoDB is NOT running (required for database)
- ❌ Backend is NOT running (required to serve data)
- ✅ Frontend IS running (but has no data to display)

---

## 📦 Required Software Installation

### 1. Install Java JDK 17 or Higher

**Check if Java is installed:**
```bash
java -version
```

**If not installed:**
1. Download from: https://adoptium.net/temurin/releases/
2. Choose: Windows x64, JDK 17 (LTS)
3. Download and install
4. Verify: `java -version`

---

### 2. Install Maven

**Check if Maven is installed:**
```bash
mvn --version
```

**If not installed (THIS IS YOUR ISSUE):**

#### Option A: Using Chocolatey (Easiest)
```bash
# Install Chocolatey first (if not installed)
# Run PowerShell as Administrator and paste:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install Maven
choco install maven
```

#### Option B: Manual Installation
1. Download from: https://maven.apache.org/download.cgi
   - Get: apache-maven-3.9.x-bin.zip
2. Extract to: `C:\Program Files\Apache\maven`
3. Add to PATH:
   - Open "Environment Variables"
   - Add to System PATH: `C:\Program Files\Apache\maven\bin`
4. Restart Command Prompt
5. Verify: `mvn --version`

---

### 3. Install MongoDB

**Check if MongoDB is installed:**
```bash
mongod --version
```

**If not installed:**

#### Option A: MongoDB Community Edition (Recommended)
1. Download from: https://www.mongodb.com/try/download/community
2. Choose: Windows, MSI
3. Install with these settings:
   - ✅ Complete installation
   - ✅ Install MongoDB as a Service
   - ✅ Run service as Network Service user
4. Verify: `mongod --version`

#### Option B: MongoDB Atlas (Cloud - No Installation)
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/moviebooking
   ```

---

## 🚀 Quick Installation Script (Windows)

**Run PowerShell as Administrator and paste:**

```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Java, Maven, and MongoDB
choco install openjdk17 -y
choco install maven -y
choco install mongodb -y

# Refresh environment
refreshenv

# Verify installations
java -version
mvn --version
mongod --version
```

---

## ✅ After Installation Checklist

Run these commands to verify everything is installed:

```bash
# Check Java
java -version
# Should show: openjdk version "17.x.x"

# Check Maven
mvn --version
# Should show: Apache Maven 3.x.x

# Check MongoDB
mongod --version
# Should show: db version v7.x.x

# Check Python (for frontend)
python --version
# Should show: Python 3.x.x
```

---

## 🎯 Next Steps After Installation

### 1. Start MongoDB
```bash
net start MongoDB
```

### 2. Initialize Database
```bash
cd "C:\Users\Aravinth\OneDrive\Desktop\Movie Ticket"
mongosh < init-mongodb.js
```

### 3. Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. Verify Backend
Open browser: http://localhost:8080/api/movies
Should see JSON data

### 5. Refresh Frontend
Go to: http://localhost:5500
Press Ctrl + F5

---

## 🐛 Common Installation Issues

### Issue: "mvn command not found" after installation
**Solution:**
1. Close and reopen Command Prompt/PowerShell
2. Or run: `refreshenv` (if using Chocolatey)
3. Or manually add Maven to PATH

### Issue: "MongoDB service won't start"
**Solution:**
```bash
# Create data directory
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

### Issue: "Java version mismatch"
**Solution:**
```bash
# Check Java version
java -version

# Should be 17 or higher
# If not, install Java 17 from adoptium.net
```

---

## 📋 Installation Time Estimates

- Java JDK: ~5 minutes
- Maven: ~2 minutes
- MongoDB: ~10 minutes
- Database initialization: ~1 minute
- Backend first build: ~5 minutes
- **Total: ~25 minutes**

---

## 🆘 Alternative: Use Pre-built JAR (If Maven Installation Fails)

If you can't install Maven, I can help you:
1. Build the backend on another machine
2. Copy the JAR file
3. Run with: `java -jar backend.jar`

---

## 💡 Recommended: Install Everything at Once

**Easiest method using Chocolatey:**

1. Open PowerShell as Administrator
2. Run this ONE command:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); choco install openjdk17 maven mongodb -y
```

3. Close and reopen PowerShell
4. Verify: `java -version && mvn --version && mongod --version`

---

## 🎬 Ready to Continue?

Once all software is installed:
1. ✅ Java 17+
2. ✅ Maven 3.x
3. ✅ MongoDB 7.x
4. ✅ Python 3.x (already installed)

**Then follow START_HERE.md to complete the setup!**

---

**Install these requirements first, then your CineBook will work perfectly!** 🚀
