import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.title}>
                    Welcome to{'\n'}
                    <Text style={styles.titleAccent}>LifeOS</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Your personal life app system. Organize, optimize, and elevate every aspect of your life.
                </Text>

                <View style={styles.ctaGroup}>
                    <Pressable style={styles.btnPrimary}>
                        <Text style={styles.btnPrimaryText}>Get Started</Text>
                    </Pressable>
                    <Pressable style={styles.btnSecondary}>
                        <Text style={styles.btnSecondaryText}>Learn More</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.features}>
                <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>📊</Text>
                    <Text style={styles.featureTitle}>Track Progress</Text>
                    <Text style={styles.featureDesc}>
                        Monitor your goals and habits with beautiful visualizations.
                    </Text>
                </View>

                <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>🎯</Text>
                    <Text style={styles.featureTitle}>Set Goals</Text>
                    <Text style={styles.featureDesc}>
                        Define and achieve your personal and professional objectives.
                    </Text>
                </View>

                <View style={styles.featureCard}>
                    <Text style={styles.featureIcon}>⚡</Text>
                    <Text style={styles.featureTitle}>Stay Productive</Text>
                    <Text style={styles.featureDesc}>
                        Boost your efficiency with smart task management.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0f',
        padding: 20,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 16,
    },
    titleAccent: {
        color: '#6366f1',
    },
    subtitle: {
        fontSize: 16,
        color: '#a0a0b0',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    ctaGroup: {
        gap: 12,
        width: '100%',
        maxWidth: 300,
    },
    btnPrimary: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    btnSecondary: {
        backgroundColor: '#1a1a24',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    btnSecondaryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    features: {
        gap: 16,
        marginTop: 20,
    },
    featureCard: {
        backgroundColor: '#1a1a24',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: 14,
        color: '#a0a0b0',
        lineHeight: 20,
    },
});
