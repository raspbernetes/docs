---
id: usb_booting
title: Boot Raspberry Pi From USB SSD
---

![USB Booting](https://github.com/raspbernetes/raspbernetes.github.io/raw/master/img/usb-boot.png 'USB Booting')

While SD cards are the most standard method of booting a Raspberry Pi, they are not always suitable for applications that require rapid [I/O](https://en.wikipedia.org/wiki/Input/output) or lots of I/O. Booting from USB is a feature that aims to help fix these two problems, in addition to inceasing the longevity of your storage.

:::warning

Please proceed at your own risk. While I personally have not seen a case in which a Raspberry Pi has become "bricked" or inoperable, it is important to keep in mind that when you are altering the `EEPROM` you may experience a loss of data or a non-bootable system. We are not responsible/liable if you use this beta software and "brick" your Pi!

:::

## Prerequisites

- Raspberry Pi (In this example we will be using a Raspberry Pi 4, 4GB)
- USB to SATA adapter
  - See [Known Working USB to SATA Adapters](#USBs)
- SATA SSD
  - SSDs are recommended for this beacuse they have lower power requirements and are much faster that typical HDDs
  - See [Known Working SSDs](#SSDs)
- SD Card
- [Ubuntu 20.04](https://ubuntu.com/download/raspberry-pi)
- [Raspberry Pi OS](https://downloads.raspberrypi.org/raspios_arm64/images/raspios_arm64-2020-05-28/2020-05-27-raspios-buster-arm64.zip)
  - Link is to 64 bit which is still in Beta as of this writing.

## Booting Raspberry Pi via USB SSD

### Testing Equipment

Before we start it is important to verify that your equipment is functioning correctly. We can do this by first flashing our SD card with *Raspberry Pi OS* and running it on our Pi. For brevity I will be omitting the process of flashing the SD card since this is a more Advanced guide. If you need help with this, please see [Installation](https://raspbernetes.github.io/docs/installation).

Once you have booted into Raspberry Pi OS, feel free to connect your SSD to the USB to SATA adapter and plug it into the Pi. I have witnessed issues when using the USB 2.0 ports (the ports that are black), so please use the USB 3.0 ports (blue). After it is plugged in, verify that you can see the drive:

```bash
lsblk
```

The output from this command should show you a block device, most likely called `sda` or something prefaced with `sd`. If you don't see your USB SSD immediately, try switching to the other 3.0 USB port, or trying a different USB to SATA cable/adapter.

Once your disk is detected we've confirmed that it is useable by the Pi, so it is safe to disconnect the drive from the Pi.

Awesome! Our disk is detected. Now we move on to the technical stuff...

### Updating Pi Firmware

#### Update Raspberry Pi OS

While your Pi is still booted to Raspberry Pi OS, run a full update on the SD card's OS:

```bash
sudo apt update
sudo apt full-upgrade -y
```

#### Start Flashing USB SSD

While the update is running, we can go ahead and flash the Ubuntu image onto our SSD. Feel free to unplug it from the Pi and image it how you see fit. It can take a little while, best to get it going while doing other things.

#### Change Bootloader Branch

With your freshly updated Rasberry Pi OS run the following to check your current bootloader version, making note of the returned version:

```bash
vcgencmd bootloader_version
```

Switch the EEPROM firmware branch:

```bash
sudo echo 'FIRMWARE_RELEASE_STATUS="stable"' > /etc/default/rpi-eeprom-update
```

#### Update Pi Bootloader Settings

Replace the current bootloader configuration settings with the beta ones that allow for USB booting:

```bash
sudo rpi-eeprom-update -d -f /lib/firmware/raspberrypi/bootloader/stable/pieeprom-2020-06-15.bin
```

This command will prompt you to reboot, so we can do so:

```bash
sudo reboot now
```

#### Verify Bootloader Firmware Version

Once you're booted back to the SD card on Raspberry Pi OS, check the bootloader version once again:

```bash
vcgencmd bootloader_version
```

This version should be different from the one that was reported before our `rpi-eeprom-update` command.

Congratulations, your Pi is now able to boot from USB! However, we aren't quite there yet.

### Setting Up our SSD for use with USB Booting

:::note

I personally found this part easier to do from our Raspberry Pi that I just got done flashing the firmware on. For that reason this section will be written from that perspective, but this should be possible using any Linux-based system.

:::

#### Drop in Pi-Specific Firmware

Plug in your SSD that has been flashed with Ubuntu 20.04. The `system-boot` and `writeable` partitions should automatically be mounted to `/media/pi/system-boot` and `/media/pi/writeable`, respectively.

Change directory to `system-boot`.

```bash
cd /media/pi/system-boot
```

Run the following [one-liner](https://gist.github.com/atomicstack/9c43e452c4b7cefb37c1e78f65b0b1fa) to patch the bootloader on our SSD with the applicable Pi firmware:

```bash
wget $( wget -qO - https://github.com/raspberrypi/firmware/tree/master/boot | perl -nE 'chomp; next unless /[.](elf|dat)/; s/.*href="([^"]+)".*/$1/; s/blob/raw/; say qq{https://github.com$_}' )
```

#### Dealing with Compressed Kernel

Copy the compressed Linux kernel to your home directory:

```bash
cp /media/pi/system-boot/vmlinuz ~/
```

Decompress the Linux kernel:

```bash
zcat ~/vmlinuz > ~/vmlinux
```

Copy the decompressed kernel to `system-boot`:

```bash
cp ~/vmlinux /media/pi/system-boot/
```

Next create a script that will automatically decompress the kernel so that we can reboot the Pi without having to do the previous steps manually every boot:

```bash
cat <<'EOF' >/media/pi/system-boot/auto_decompress_kernel
#!/bin/bash -e

#Set Variables
BTPATH=/boot/firmware
CKPATH=$BTPATH/vmlinuz
DKPATH=$BTPATH/vmlinux

#Check if compression needs to be done.
if [ -e $BTPATH/check.md5 ]; then
	if md5sum --status --ignore-missing -c $BTPATH/check.md5; then
	echo -e "\e[32mFiles have not changed, Decompression not needed\e[0m"
	exit 0
	else echo -e "\e[31mHash failed, kernel will be compressed\e[0m"
	fi
fi

#Backup the old decompressed kernel
mv $DKPATH $DKPATH.bak

if [ ! $? == 0 ]; then
	echo -e "\e[31mDECOMPRESSED KERNEL BACKUP FAILED!\e[0m"
	exit 1
else 	echo -e "\e[32mDecompressed kernel backup was successful\e[0m"
fi

#Decompress the new kernel
echo "Decompressing kernel: "$CKPATH".............."

zcat $CKPATH > $DKPATH

if [ ! $? == 0 ]; then
	echo -e "\e[31mKERNEL FAILED TO DECOMPRESS!\e[0m"
	exit 1
else
	echo -e "\e[32mKernel Decompressed Succesfully\e[0m"
fi

#Hash the new kernel for checking
md5sum $CKPATH $DKPATH > $BTPATH/check.md5

if [ ! $? == 0 ]; then
	echo -e "\e[31mMD5 GENERATION FAILED!\e[0m"
	else echo -e "\e[32mMD5 generated Succesfully\e[0m"
fi

#Exit
exit 0
EOF
```

Create an `apt` hook that decompresses the kernel on updates:

```bash
cat <<EOF >/media/pi/writeable/etc/apt/apt.conf.d/999_decompress_rpi_kernel
DPkg::Post-Invoke {"/bin/bash /boot/firmware/auto_decompress_kernel"; };
EOF
```

Make this hook executeable:

```bash
sudo chmod +x /media/pi/writeable/etc/apt/apt.conf.d/999_decompress_rpi_kernel
```

#### Alter the Bootloader Config

Edit the bootloader config in the `[rpi4]` section to look like this:

:::note

It may be necessary to make an additional parameter if your USB storage is uncharacteristically slow. Just uncomment the `boot_delay` parameter.

:::

```bash
[pi4]
max_framebuffers=2
dtoverlay=vc4-fkms-v3d
#boot_delay
kernel=vmlinux
initramfs initrd.img followkernel
```

### Wrapping Up

Whew, that was a lot of stuff to do just to make our SSD image bootable! But that's all. From here I suggest shutting down the Pi:

```bash
sudo shutdown now
```

Once the Pi is powered off, remove your SD card, double check to make sure your USB SSD is properly seated, and power it back on.

Your system should now boot from the USB SSD.

#### Verify SSD Boot

After it's booted give it a minute or so for `cloud-init` to complete, and log in with username and password `ubuntu`. It will prompt for a password change upon login. From here, we can check to make sure the SSD is mounted properly:

```bash
df -h
Filesystem      Size  Used Avail Use% Mounted on
...
/dev/sda2       110G  2.1G  104G   2% /
...
/dev/sda1       253M  157M   96M  63% /boot/firmware
...
```

##### Install Updates

Go ahead and install updates for Ubuntu and reboot:

```bash
sudo apt update && sudo apt full-upgrade -y
```

```bash
sudo reboot now
```

##### Verify Reboots are Working

When your host has rebooted, just make sure it boots back into Ubuntu. If it hangs or doesn't make it to the OS, there is something wrong. Feel free to reach out to folks on the [Discord](https://discord.gg/RGvKzVg) if you run into trouble.

### Appendix

#### Relevant Links

- https://www.raspberrypi.org/documentation/hardware/raspberrypi/bcm2711_bootloader_config.md#usbmassstorageboot
- https://www.raspberrypi.org/forums/viewtopic.php?t=278791
- https://www.jeffgeerling.com/blog/2020/im-booting-my-raspberry-pi-4-usb-ssd
- https://gist.github.com/atomicstack/9c43e452c4b7cefb37c1e78f65b0b1fa
- https://www.maketecheasier.com/boot-raspberry-pi-4-from-usb/


#### Products

A list of products that have been known to work, verified by our Discord community. If you're using different equipment with success, please make a PR to list it!

##### SSDs

- [Kingston SA400S37](https://www.amazon.com/gp/product/B01N6JQS8C/ref=ppx_yo_dt_b_asin_title_o03_s01?ie=UTF8&psc=1)

##### USBs

- [StarTech USB3S2SAT3CB](https://www.amazon.com/gp/product/B00HJZJI84/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1)
- [Insignia NS-PCHD235](https://www.bestbuy.com/site/insignia-2-5-serial-ata-hard-drive-enclosure-black/5820005.p?skuId=5820005)
