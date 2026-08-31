package com.jobportal.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get Authorization header
        final String authHeader = request.getHeader("Authorization");

        // No JWT token
        if (authHeader == null || !authHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        final String token = authHeader.substring(7).trim();

        try {

            // Extract email from JWT
            final String email = jwtUtil.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                // Load user from database
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                // Validate JWT
                if (jwtUtil.isTokenValid(
                        token,
                        userDetails.getUsername())) {

                    // Create authentication object
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Add request details
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Set authentication in SecurityContext
                    org.springframework.security.core.context.SecurityContext context =
                            SecurityContextHolder.createEmptyContext();
                    context.setAuthentication(authToken);
                    SecurityContextHolder.setContext(context);

                    // Debug logs
                    System.out.println("=================================");
                    System.out.println("JWT AUTHENTICATION SUCCESS");
                    System.out.println("EMAIL = " + email);
                    System.out.println(
                            "AUTHORITIES = " +
                                    userDetails.getAuthorities()
                    );
                    System.out.println("=================================");
                }
            }

        } catch (Exception e) {

            System.out.println("=================================");
            System.out.println("JWT AUTHENTICATION FAILED");
            System.out.println("ERROR = " + e.getMessage());
            System.out.println("=================================");

            SecurityContextHolder.clearContext();
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}