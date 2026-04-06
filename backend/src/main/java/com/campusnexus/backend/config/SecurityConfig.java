package com.campusnexus.backend.config;

import com.campusnexus.backend.security.CustomOidcUserService;
import com.campusnexus.backend.security.OAuth2UserServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final OAuth2UserServiceImpl oAuth2UserService;
    private final CustomOidcUserService customOidcUserService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public SecurityConfig(OAuth2UserServiceImpl oAuth2UserService,
                          CustomOidcUserService customOidcUserService) {
        this.oAuth2UserService = oAuth2UserService;
        this.customOidcUserService = customOidcUserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/error", "/uploads/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/resources/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasRole("ADMIN")

                        // Tickets
                        .requestMatchers(HttpMethod.POST, "/api/tickets").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/tickets/my").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/tickets/assigned").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tickets").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tickets/*").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/tickets/*").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/assign").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/status").hasAnyRole("STAFF", "ADMIN")

                         // Bookings
                        .requestMatchers(HttpMethod.POST, "/api/bookings/resource/*").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/bookings/my").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/bookings").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/bookings/*").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/bookings/*/qr").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/*/resource/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/*").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/cancel").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/reject").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/status/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/date/*").hasRole("ADMIN")

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .defaultAuthenticationEntryPointFor(
                                (request, response, authException) ->
                                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"),
                                request -> request.getRequestURI().startsWith("/api/")
                        )
                        .defaultAccessDeniedHandlerFor(
                                (request, response, accessDeniedException) ->
                                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden"),
                                request -> request.getRequestURI().startsWith("/api/")
                        )
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserService)
                                .oidcUserService(customOidcUserService)
                        )
                        .defaultSuccessUrl(frontendUrl + "/", true)
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl(frontendUrl + "/login")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}