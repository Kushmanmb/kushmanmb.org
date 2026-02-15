# Deployment Guide for kushmanmb.org

This guide explains how to deploy the kushmanmb.org website to your custom domain.

## Website Files

The main website consists of:
- `index.html` - Landing page (root level)
- `website-style.css` - Styling for the landing page
- `src/` directory - Contains the Fleeing 5-0 game and other resources
- Documentation files (README.md, OWNERSHIP.md, etc.)

## Deployment Options

### Option 1: GitHub Pages

1. Go to your repository settings: `https://github.com/kushmanmb-org/kushmanmb.org/settings/pages`
2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: Select `main` or your preferred branch
   - Folder: Select `/ (root)`
3. Click "Save"
4. GitHub will automatically deploy your site

#### Custom Domain Setup (GitHub Pages)

1. In the same GitHub Pages settings, under "Custom domain":
   - Enter `kushmanmb.org`
   - Click "Save"
2. Configure DNS with your domain registrar:
   - Add an A record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a CNAME record pointing to `kushmanmb-org.github.io`
3. Wait for DNS propagation (can take up to 24 hours)
4. Enable "Enforce HTTPS" once DNS is configured

### Option 2: Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build` (optional)
   - Publish directory: `/` (root)
5. Click "Deploy site"

#### Custom Domain Setup (Netlify)

1. In Netlify site settings, go to "Domain management"
2. Click "Add custom domain"
3. Enter `kushmanmb.org`
4. Follow Netlify's instructions to configure DNS
5. Netlify will automatically provision SSL certificate

### Option 3: Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Other
   - Build Command: `npm run build` (optional)
   - Output Directory: `/` (root)
5. Click "Deploy"

#### Custom Domain Setup (Vercel)

1. In Vercel project settings, go to "Domains"
2. Add `kushmanmb.org`
3. Configure DNS as instructed by Vercel
4. Vercel will automatically provision SSL certificate

### Option 4: Traditional Web Hosting

For providers like DigitalOcean, AWS S3, or traditional cPanel hosting:

1. Build the project (if needed):
   ```bash
   npm run build
   ```

2. Upload these files to your web server:
   ```
   index.html
   website-style.css
   src/
   README.md
   CODING_GUIDELINES.md
   OWNERSHIP.md
   CREATOR_ATTRIBUTION.md
   SECURITY_SUMMARY.md
   LICENSE
   dist/ (if using the game build)
   ```

3. Configure your web server:
   - Set `index.html` as the default document
   - Enable HTTPS/SSL
   - Configure any necessary redirects

4. Point your domain DNS to your server's IP address

## Testing Your Deployment

After deployment, verify:

1. **Homepage loads**: Visit `https://kushmanmb.org`
2. **Styling applied**: Check that colors, layout, and animations work
3. **Links work**:
   - "Play Game" button leads to the slot machine game
   - Documentation links open correctly
   - GitHub link works
4. **Responsive design**: Test on mobile and desktop
5. **HTTPS enabled**: Ensure secure connection

## Local Testing

Before deploying, test locally:

```bash
# Option 1: Python simple server
python3 -m http.server 8080

# Option 2: Node.js http-server
npx http-server -p 8080

# Then visit: http://localhost:8080
```

## Troubleshooting

### Links not working
- Ensure all referenced files exist in the deployed directory
- Check that file paths are correct and case-sensitive

### Styling not applied
- Verify `website-style.css` is in the same directory as `index.html`
- Check browser console for any loading errors
- Clear browser cache

### Game not loading
- Ensure `src/` directory is uploaded
- Verify `src/index.html` and related files exist
- Check that the path `src/index.html` is accessible

### DNS not resolving
- DNS changes can take up to 24-48 hours to propagate
- Use `dig kushmanmb.org` or `nslookup kushmanmb.org` to check DNS
- Verify DNS records are correctly configured

## Security Considerations

- Always enable HTTPS/SSL
- Keep dependencies updated (run `npm audit` regularly)
- Follow the security guidelines in `SECURITY_SUMMARY.md`
- Protect sensitive environment variables (`.env` file)

## Maintenance

Regular maintenance tasks:

1. Update dependencies: `npm update`
2. Run security audits: `npm audit`
3. Test all functionality after updates
4. Keep documentation up to date
5. Monitor for broken links

## Support

For issues or questions:
- GitHub Issues: [kushmanmb-org/kushmanmb.org/issues](https://github.com/kushmanmb-org/kushmanmb.org/issues)
- See `OWNERSHIP.md` for contact information
- Review `README.md` for comprehensive documentation
