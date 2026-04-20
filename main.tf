# 1. INITIALISATION DU PROVIDER
# Ce bloc télécharge le "pilote" pour que Terraform puisse piloter VirtualBox
terraform {
  required_providers {
    virtualbox = {
      source  = "terra-farm/virtualbox"
      version = "0.2.2-alpha.1"
    }
  }
}

# 2. MACHINE WEB (Frontend + Backend Spotify)
# Stockage : 20 Go | RAM : 2 Go
resource "virtualbox_vm" "vm_web" {
  name      = "Spotify-Web-Server"
  image     = "https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64-vagrant.box"
  cpus      = 2
  memory    = "2048 mib"


  network_adapter {
    type           = "hostonly"
    host_interface = "VirtualBox Host-Only Ethernet Adapter"
  }
  
  network_adapter {
    type = "nat"
  }
  provisioner "remote-exec" {
    connection {
      type     = "ssh"
      user     = "vagrant"
      password = "vagrant"
      host     = self.network_adapter[0].ipv4_address
    }

    inline = [
      # 1. Configurer la clé SSH
      "mkdir -p /home/vagrant/.ssh",
      "echo '${file("./id_rsa.pub")}' >> /home/vagrant/.ssh/authorized_keys",
      "chmod 700 /home/vagrant/.ssh",
      "chmod 600 /home/vagrant/.ssh/authorized_keys",
      
      # 2. Activer la carte NAT pour Internet
      "sudo ip link set enp0s8 up",
      "sudo dhclient enp0s8",
      
      # 3. Installer Docker automatiquement
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "sudo usermod -aG docker vagrant"
    ]
  }
}

# 3. MACHINE DATABASE (PostgreSQL)
# Stockage : 20 Go | RAM : 1 Go
resource "virtualbox_vm" "vm_db" {
  name      = "Spotify-Database-Server"
  image     = "https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64-vagrant.box"
  cpus      = 1
  memory    = "1024 mib"


  network_adapter {
    type           = "hostonly"
    host_interface = "VirtualBox Host-Only Ethernet Adapter"
  }
  
  network_adapter {
    type = "nat"
  }
   provisioner "remote-exec" {
    connection {
      type     = "ssh"
      user     = "vagrant"
      password = "vagrant"
      host     = self.network_adapter[0].ipv4_address
    }

    inline = [
      # 1. Configurer la clé SSH
      "mkdir -p /home/vagrant/.ssh",
      "echo '${file("./id_rsa.pub")}' >> /home/vagrant/.ssh/authorized_keys",
      "chmod 700 /home/vagrant/.ssh",
      "chmod 600 /home/vagrant/.ssh/authorized_keys",
      
      # 2. Activer la carte NAT pour Internet
      "sudo ip link set enp0s8 up",
      "sudo dhclient enp0s8",
      
      # 3. Installer Docker automatiquement
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "sudo usermod -aG docker vagrant"
    ]
  }
}

# 4. MACHINE STORAGE (MinIO pour les fichiers audio)
# Stockage : 30 Go | RAM : 2 Go
resource "virtualbox_vm" "vm_storage" {
  name      = "Spotify-Storage-Server"
  image     = "https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64-vagrant.box"
  cpus      = 1
  memory    = "2048 mib"


  network_adapter {
    type           = "hostonly"
    host_interface = "VirtualBox Host-Only Ethernet Adapter"
  }

  network_adapter {
    type = "nat"
  }
   provisioner "remote-exec" {
    connection {
      type     = "ssh"
      user     = "vagrant"
      password = "vagrant"
      host     = self.network_adapter[0].ipv4_address
    }

    inline = [
      # 1. Configurer la clé SSH
      "mkdir -p /home/vagrant/.ssh",
      "echo '${file("./id_rsa.pub")}' >> /home/vagrant/.ssh/authorized_keys",
      "chmod 700 /home/vagrant/.ssh",
      "chmod 600 /home/vagrant/.ssh/authorized_keys",
      
      # 2. Activer la carte NAT pour Internet
      "sudo ip link set enp0s8 up",
      "sudo dhclient enp0s8",
      
      # 3. Installer Docker automatiquement
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "sudo usermod -aG docker vagrant"
    ]
  }
}