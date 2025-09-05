# Configuration Backend pour le Support de l'Arabe

## Configurations nécessaires pour le Backend Java Spring Boot

### 1. Configuration de la Base de Données

#### MySQL/MariaDB
```sql
-- Créer la base de données avec le bon charset
CREATE DATABASE bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Modifier les tables existantes
ALTER TABLE books CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE packs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE daily_offers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE customers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Modifier les colonnes de texte spécifiquement
ALTER TABLE books MODIFY COLUMN title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE books MODIFY COLUMN author VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE books MODIFY COLUMN description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE books MODIFY COLUMN category VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE books MODIFY COLUMN language VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Pour les autres tables
ALTER TABLE customers MODIFY COLUMN first_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE customers MODIFY COLUMN last_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE customers MODIFY COLUMN address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE customers MODIFY COLUMN city VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configuration Spring Boot (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/bookstore?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
    username: your_username
    password: your_password
    
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
        show_sql: false
        connection:
          CharSet: utf8mb4
          characterEncoding: utf8
          useUnicode: true
          
  http:
    encoding:
      charset: UTF-8
      enabled: true
      force: true

server:
  servlet:
    encoding:
      charset: UTF-8
      enabled: true
      force: true
```

### 3. Configuration CORS mise à jour (CorsConfig.java)

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4201", "http://192.168.50.198:4201")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .exposedHeaders("Content-Type", "X-Requested-With", "accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers");
    }
    
    @Bean
    public CharacterEncodingFilter characterEncodingFilter() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
        return filter;
    }
}
```

### 4. Configuration des Entités JPA

Assurez-vous que vos entités utilisent les bonnes annotations :

```java
@Entity
@Table(name = "books")
public class Book {
    
    @Column(name = "title", nullable = false, length = 255)
    private String title; // Peut contenir de l'arabe
    
    @Column(name = "author", nullable = false, length = 255)  
    private String author; // Peut contenir de l'arabe
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Peut contenir de l'arabe
    
    @Column(name = "category", length = 100)
    private String category; // Peut contenir de l'arabe
    
    @Column(name = "language", length = 50)
    private String language; // "العربية", "Français", "English"
    
    // ... autres champs
}

@Entity
@Table(name = "customers")
public class Customer {
    
    @Column(name = "first_name", nullable = false, length = 255)
    private String firstName; // Peut contenir de l'arabe
    
    @Column(name = "last_name", nullable = false, length = 255)
    private String lastName; // Peut contenir de l'arabe
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address; // Peut contenir de l'arabe
    
    @Column(name = "city", length = 255)
    private String city; // Peut contenir de l'arabe
    
    // ... autres champs
}
```

### 5. Validation des Données

Mise à jour des validations pour supporter l'arabe :

```java
@Entity
public class Book {
    
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\p{P}\\p{Z}]+$", message = "Title contains invalid characters")
    private String title;
    
    @NotBlank(message = "Author is required") 
    @Size(min = 2, max = 100, message = "Author must be between 2 and 100 characters")
    @Pattern(regexp = "^[\\p{L}\\p{P}\\p{Z}]+$", message = "Author name contains invalid characters")
    private String author;
    
    // ... autres validations
}
```

### 6. Configuration du Contrôleur

Ajout d'headers pour l'UTF-8 :

```java
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    
    @GetMapping(value = "/all", produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<Book>> getAllBooks() {
        // ...
    }
    
    @PostMapping(consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        // ...
    }
}
```

### 7. Configuration des Données de Test

Exemples de données en arabe pour les tests :

```java
@Component
public class DataInitializer {
    
    @PostConstruct
    public void initData() {
        // Livres en arabe
        Book arabicBook = new Book();
        arabicBook.setTitle("الأسود يليق بك");
        arabicBook.setAuthor("أحلام مستغانمي");
        arabicBook.setDescription("رواية عربية معاصرة تحكي قصة حب وفقدان");
        arabicBook.setLanguage("العربية");
        arabicBook.setCategory("أدب");
        arabicBook.setPrice(new BigDecimal("75.00"));
        
        // Packs en arabe
        Pack arabicPack = new Pack();
        arabicPack.setName("مجموعة الأدب العربي");
        arabicPack.setDescription("مختارات من أفضل الروايات العربية المعاصرة");
        arabicPack.setCategory("أدب عربي");
        arabicPack.setPrice(new BigDecimal("200.00"));
        
        // ... sauvegarder en base
    }
}
```

### 8. Indexation et Recherche

Configuration pour la recherche en arabe :

```java
@Repository
public class BookRepository extends JpaRepository<Book, Long> {
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchBooks(@Param("keyword") String keyword);
    
    // Recherche spécialisée pour l'arabe
    @Query(value = "SELECT * FROM books WHERE " +
                   "MATCH(title, author, description) AGAINST(:keyword IN NATURAL LANGUAGE MODE)", 
           nativeQuery = true)
    List<Book> fullTextSearchArabic(@Param("keyword") String keyword);
}
```

### 9. Tests avec l'Arabe

```java
@Test
public void testArabicBookCreation() {
    Book book = new Book();
    book.setTitle("كتاب باللغة العربية");
    book.setAuthor("مؤلف عربي");
    book.setDescription("وصف الكتاب باللغة العربية");
    book.setLanguage("العربية");
    
    Book saved = bookRepository.save(book);
    
    assertThat(saved.getTitle()).isEqualTo("كتاب باللغة العربية");
    assertThat(saved.getAuthor()).isEqualTo("مؤلف عربي");
}
```

### 10. Déploiement et Monitoring

- Vérifier que le serveur d'application supporte UTF-8
- Configurer les logs pour afficher correctement l'arabe
- Tester les endpoints avec des données en arabe
- Monitorer les performances des requêtes avec du texte arabe

## Points Importants

1. **Encodage UTF-8** : Toujours utiliser UTF-8 partout (BDD, application, headers HTTP)
2. **Validation Regex** : Utiliser `\\p{L}` pour les lettres Unicode (inclut l'arabe)
3. **Indexation** : Configurer MySQL avec utf8mb4_unicode_ci pour un bon tri/recherche
4. **Tests** : Tester systématiquement avec du contenu en arabe
5. **Performance** : Les chaînes arabes peuvent être plus longues, ajuster les limites

Cette configuration assure que votre backend Java Spring Boot peut correctement gérer, stocker et rechercher du contenu en arabe.