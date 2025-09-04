import { Shield, Server, Key, Settings, Globe, CheckCircle2 } from "lucide-react";
import { StepCard } from "@/components/StepCard";
import { CodeBlock } from "@/components/CodeBlock";
import { WarningBox } from "@/components/WarningBox";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">WireGuard VPN Server Setup</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Complete step-by-step guide to set up your own VPN server on Ubuntu 22.04 using WireGuard
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-12">
          
          {/* Prerequisites */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Server className="w-6 h-6 text-primary" />
              Prerequisites
            </h2>
            <div className="bg-card rounded-lg p-6 border">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Fresh Ubuntu 22.04 LTS server
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Root or sudo access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Public IP address
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  UDP port 51820 accessible from the internet
                </li>
              </ul>
            </div>
          </section>

          {/* Step 1: Update System and Install WireGuard */}
          <StepCard stepNumber={1} title="Update System and Install WireGuard">
            <p className="text-muted-foreground">
              First, let's update the system and install WireGuard along with required tools.
            </p>
            
            <CodeBlock 
              title="Update system packages"
              code={`sudo apt update && sudo apt upgrade -y`}
            />
            
            <CodeBlock 
              title="Install WireGuard and tools"
              code={`sudo apt install wireguard wireguard-tools -y`}
            />
            
            <CodeBlock 
              title="Install additional utilities"
              code={`sudo apt install ufw iptables-persistent -y`}
            />
          </StepCard>

          {/* Step 2: Generate Server Keys */}
          <StepCard stepNumber={2} title="Generate Server Private and Public Keys">
            <p className="text-muted-foreground">
              Generate the cryptographic keys for your WireGuard server.
            </p>
            
            <CodeBlock 
              title="Create WireGuard directory and set permissions"
              code={`sudo mkdir -p /etc/wireguard
sudo chmod 700 /etc/wireguard`}
            />
            
            <CodeBlock 
              title="Generate server private key"
              code={`sudo sh -c 'wg genkey > /etc/wireguard/server_private.key'
sudo chmod 600 /etc/wireguard/server_private.key`}
            />
            
            <CodeBlock 
              title="Generate server public key"
              code={`sudo sh -c 'cat /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key'`}
            />
            
            <CodeBlock 
              title="View the generated keys (optional)"
              code={`sudo cat /etc/wireguard/server_private.key
sudo cat /etc/wireguard/server_public.key`}
            />
          </StepCard>

          {/* Step 3: Configure Server */}
          <StepCard stepNumber={3} title="Configure WireGuard Server">
            <p className="text-muted-foreground">
              Create the main server configuration file with proper network settings.
            </p>
            
            <WarningBox>
              Replace <code>YOUR_SERVER_PRIVATE_KEY</code> with the actual private key from the previous step, and <code>eth0</code> with your server's network interface if different.
            </WarningBox>
            
            <CodeBlock 
              title="Create server configuration"
              code={`sudo nano /etc/wireguard/wg0.conf`}
            />
            
            <CodeBlock 
              title="Add this configuration to wg0.conf"
              code={`[Interface]
# Server private key (replace with your actual key)
PrivateKey = YOUR_SERVER_PRIVATE_KEY
# VPN subnet
Address = 10.8.0.1/24
# UDP port for WireGuard
ListenPort = 51820
# Save client configurations
SaveConfig = true

# Post-up and post-down scripts for NAT
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client configurations will be added here automatically`}
            />
            
            <CodeBlock 
              title="Set proper permissions"
              code={`sudo chmod 600 /etc/wireguard/wg0.conf`}
            />
          </StepCard>

          {/* Step 4: Enable IP Forwarding */}
          <StepCard stepNumber={4} title="Enable IP Forwarding">
            <p className="text-muted-foreground">
              Configure the system to forward packets between the VPN and internet.
            </p>
            
            <CodeBlock 
              title="Enable IP forwarding temporarily"
              code={`sudo sysctl -w net.ipv4.ip_forward=1`}
            />
            
            <CodeBlock 
              title="Make IP forwarding permanent"
              code={`echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf`}
            />
            
            <CodeBlock 
              title="Apply the changes"
              code={`sudo sysctl -p`}
            />
          </StepCard>

          {/* Step 5: Configure Firewall */}
          <StepCard stepNumber={5} title="Configure Firewall (UFW)">
            <p className="text-muted-foreground">
              Set up firewall rules to allow VPN traffic while maintaining security.
            </p>
            
            <CodeBlock 
              title="Allow SSH (important - don't lock yourself out!)"
              code={`sudo ufw allow ssh`}
            />
            
            <CodeBlock 
              title="Allow WireGuard port"
              code={`sudo ufw allow 51820/udp`}
            />
            
            <CodeBlock 
              title="Allow forwarding through VPN interface"
              code={`sudo ufw route allow in on wg0 out on eth0`}
            />
            
            <CodeBlock 
              title="Enable UFW"
              code={`sudo ufw --force enable`}
            />
            
            <CodeBlock 
              title="Check firewall status"
              code={`sudo ufw status`}
            />
          </StepCard>

          {/* Step 6: Start WireGuard */}
          <StepCard stepNumber={6} title="Start and Enable WireGuard">
            <p className="text-muted-foreground">
              Start the WireGuard service and enable it to start automatically on boot.
            </p>
            
            <CodeBlock 
              title="Start WireGuard interface"
              code={`sudo wg-quick up wg0`}
            />
            
            <CodeBlock 
              title="Enable WireGuard to start on boot"
              code={`sudo systemctl enable wg-quick@wg0`}
            />
            
            <CodeBlock 
              title="Check WireGuard status"
              code={`sudo wg show`}
            />
            
            <CodeBlock 
              title="Check if interface is up"
              code={`ip addr show wg0`}
            />
          </StepCard>

          {/* Step 7: Generate Client Keys */}
          <StepCard stepNumber={7} title="Generate Client Keys">
            <p className="text-muted-foreground">
              Create cryptographic keys for your first client device.
            </p>
            
            <CodeBlock 
              title="Generate client private key"
              code={`sudo sh -c 'wg genkey > /etc/wireguard/client1_private.key'
sudo chmod 600 /etc/wireguard/client1_private.key`}
            />
            
            <CodeBlock 
              title="Generate client public key"
              code={`sudo sh -c 'cat /etc/wireguard/client1_private.key | wg pubkey > /etc/wireguard/client1_public.key'`}
            />
            
            <CodeBlock 
              title="View client keys"
              code={`sudo cat /etc/wireguard/client1_private.key
sudo cat /etc/wireguard/client1_public.key`}
            />
          </StepCard>

          {/* Step 8: Add Client to Server */}
          <StepCard stepNumber={8} title="Add Client to Server Configuration">
            <p className="text-muted-foreground">
              Add the client configuration to your server's WireGuard config.
            </p>
            
            <WarningBox>
              Replace <code>CLIENT1_PUBLIC_KEY</code> with the actual public key generated in the previous step.
            </WarningBox>
            
            <CodeBlock 
              title="Add client to server config"
              code={`sudo sh -c 'cat >> /etc/wireguard/wg0.conf << EOF

[Peer]
# Client 1
PublicKey = CLIENT1_PUBLIC_KEY
AllowedIPs = 10.8.0.2/32
EOF'`}
            />
            
            <CodeBlock 
              title="Restart WireGuard to apply changes"
              code={`sudo wg-quick down wg0
sudo wg-quick up wg0`}
            />
          </StepCard>

          {/* Step 9: Create Client Configuration */}
          <StepCard stepNumber={9} title="Create Client Configuration File">
            <p className="text-muted-foreground">
              Generate a configuration file that you can import into WireGuard clients.
            </p>
            
            <WarningBox>
              Replace the following placeholders:
              <ul className="mt-2 list-disc list-inside">
                <li><code>CLIENT1_PRIVATE_KEY</code> - Client's private key</li>
                <li><code>YOUR_SERVER_PUBLIC_IP</code> - Your server's public IP address</li>
                <li><code>SERVER_PUBLIC_KEY</code> - Server's public key</li>
              </ul>
            </WarningBox>
            
            <CodeBlock 
              title="Create client configuration file"
              code={`sudo tee /etc/wireguard/client1.conf << EOF
[Interface]
PrivateKey = CLIENT1_PRIVATE_KEY
Address = 10.8.0.2/24
DNS = 8.8.8.8, 8.8.4.4

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = YOUR_SERVER_PUBLIC_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF`}
            />
            
            <CodeBlock 
              title="Display the complete client config"
              code={`sudo cat /etc/wireguard/client1.conf`}
            />
            
            <p className="text-sm text-muted-foreground">
              Copy this entire configuration and save it as <code>client1.conf</code> on your client device, or use a QR code generator for mobile devices.
            </p>
          </StepCard>

          {/* Step 10: Testing */}
          <StepCard stepNumber={10} title="Test Your VPN Connection">
            <p className="text-muted-foreground">
              Verify that your VPN server is working correctly.
            </p>
            
            <div className="bg-card rounded-lg p-6 border">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Testing Steps:
              </h4>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Download the WireGuard app on your device (Windows/Android/iOS)</li>
                <li>Import the <code>client1.conf</code> file or scan a QR code</li>
                <li>Connect to the VPN</li>
                <li>Check your IP address at <a href="https://whatismyipaddress.com" className="text-primary hover:underline">whatismyipaddress.com</a></li>
                <li>Verify it shows your server's IP, not your real IP</li>
              </ol>
            </div>
            
            <CodeBlock 
              title="Check connected clients on server"
              code={`sudo wg show`}
            />
            
            <CodeBlock 
              title="Monitor VPN traffic"
              code={`sudo wg show wg0 transfer`}
            />
            
            <CodeBlock 
              title="Check server logs"
              code={`sudo journalctl -u wg-quick@wg0 -f`}
            />
          </StepCard>

          {/* Additional Commands */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Additional Useful Commands
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-3">Management Commands</h3>
                <div className="space-y-4">
                  <CodeBlock 
                    title="Stop WireGuard"
                    code={`sudo wg-quick down wg0`}
                  />
                  
                  <CodeBlock 
                    title="Restart WireGuard"
                    code={`sudo wg-quick down wg0 && sudo wg-quick up wg0`}
                  />
                  
                  <CodeBlock 
                    title="Check service status"
                    code={`sudo systemctl status wg-quick@wg0`}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Troubleshooting</h3>
                <div className="space-y-4">
                  <CodeBlock 
                    title="Check IP forwarding"
                    code={`cat /proc/sys/net/ipv4/ip_forward`}
                  />
                  
                  <CodeBlock 
                    title="View iptables rules"
                    code={`sudo iptables -L -n -v`}
                  />
                  
                  <CodeBlock 
                    title="Check network interfaces"
                    code={`ip addr show`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Security Notes */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Key className="w-6 h-6 text-primary" />
              Security Best Practices
            </h2>
            
            <div className="grid gap-4">
              <WarningBox title="Key Management">
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep private keys secure and never share them</li>
                  <li>Generate unique key pairs for each client</li>
                  <li>Regularly rotate keys for enhanced security</li>
                </ul>
              </WarningBox>
              
              <WarningBox title="Network Security">
                <ul className="list-disc list-inside space-y-1">
                  <li>Only allow necessary ports through the firewall</li>
                  <li>Consider changing the default WireGuard port (51820)</li>
                  <li>Monitor connection logs regularly</li>
                  <li>Keep your Ubuntu server updated with security patches</li>
                </ul>
              </WarningBox>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            🔒 Your WireGuard VPN server is now ready to use! Remember to backup your configuration files.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;