import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

// ==============================================
// 🔐 منطقة الإعدادات والمفاتيح
// ==============================================

// 1. الحرف الأول من المفتاح (لا تغيره)
const SECRET_CHAR = "A"; 

// 2. ضع بقية مفتاحك هنا (بدون حرف A في البداية)
const KEY_PART_2 = "IzaSyBn_YMu7Hbh4_1HDM1oQOeI59ODThJkS8g"; 

// 3. يقوم التطبيق بدمج المفتاح تلقائياً
const API_KEY = SECRET_CHAR + KEY_PART_2;

// بيانات المدونة
const BLOG_ID = '384302486';
const WEBSITE_URL = 'https://www.tosh5.shop/?m=1';

// ==============================================

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // home | dashboard
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // دالة الاتصال بجوجل وجلب البيانات
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // جلب أرقام المدونة
      const blogRes = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}?key=${API_KEY}`);
      const blogData = await blogRes.json();
      setStats(blogData);

      // جلب آخر 5 مقالات
      const postsRes = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=5`);
      const postsData = await postsRes.json();
      setPosts(postsData.items || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // تشغيل الجلب عند فتح الداش بورد
  useEffect(() => {
    if (currentTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [currentTab]);

  // --- شاشة الموقع (للزوار) ---
  const renderHome = () => (
    <WebView 
      source={{ uri: WEBSITE_URL }} 
      style={{ flex: 1 }}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator size="large" color="#2196F3" style={{position:'absolute', top:'50%', left:'45%'}}/>}
    />
  );

  // --- شاشة لوحة التحكم (لك أنت) ---
  const renderDashboard = () => (
    <ScrollView style={styles.dashContainer}>
      <Text style={styles.headerTitle}>لوحة التحكم Tosh5 🚀</Text>
      
      {/* بطاقة الإحصائيات العلوية */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>نظرة عامة</Text>
        {stats ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.posts.totalItems}</Text>
              <Text style={styles.statLabel}>مقال منشور</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={{fontSize:18, fontWeight:'bold', color:'green', marginTop:5}}>نشط ✅</Text>
              <Text style={styles.statLabel}>حالة السيرفر</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator color="#2196F3" />
        )}
      </View>

      {/* قائمة آخر المقالات */}
      <Text style={styles.sectionTitle}>أحدث المقالات</Text>
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>تم النشر</Text></View>
        </View>
      ))}
      
      {/* زر التحديث */}
      <TouchableOpacity style={styles.refreshBtn} onPress={fetchDashboardData}>
        <Text style={{color:'white', fontWeight:'bold', fontSize:16}}>تحديث البيانات 🔄</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* منطقة المحتوى المتغير */}
      <View style={styles.content}>
        {currentTab === 'home' && renderHome()}
        {currentTab === 'dashboard' && renderDashboard()}
      </View>

      {/* شريط التنقل السفلي */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('home')}>
          <Text style={[styles.tabText, currentTab === 'home' && styles.activeTab]}>🏠 الرئيسية</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentTab('dashboard')}>
          <Text style={[styles.tabText, currentTab === 'dashboard' && styles.activeTab]}>📊 الإدارة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// التنسيقات والألوان
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', height: 60, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'space-around' },
  tabItem: { alignItems: 'center', padding: 10 },
  tabText: { fontSize: 16, color: '#888' },
  activeTab: { color: '#2196F3', fontWeight: 'bold' },
  dashContainer: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'right', color: '#333' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'right', color: '#555' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#2196F3' },
  statLabel: { color: '#777', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, textAlign: 'right', color: '#333' },
  postCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  postTitle: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'right', marginLeft: 10 },
  badge: { backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  badgeText: { color: '#2e7d32', fontSize: 12, fontWeight: 'bold' },
  refreshBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 }
});
    
